const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const fs = require('fs');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();


const sequelize = require("./util/database");
const user = require("./models/user");
const expenses = require("./models/expense");
const orders = require('./models/orders');
const fPassword = require('./models/forgotPassword');
const downloads = require('./models/downloads');

const app = express();

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase")
const indexRoutes = require("./routes/index");
const passwordRoutes = require("./routes/password");

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/password", passwordRoutes);
app.use(indexRoutes);

user.hasMany(expenses);
expenses.belongsTo(user);

user.hasMany(orders);
orders.belongsTo(user);

user.hasMany(fPassword);
fPassword.belongsTo(user);

user.hasMany(downloads);
downloads.belongsTo(user);

sequelize
  .sync()
  //.sync({ force: true }) //it syncs our models to the database by creating the appropriate tables and relations if we have them
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
