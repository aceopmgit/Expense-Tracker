const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
require('dotenv').config();

const sequelize = require("./util/database");
const user = require("./models/user");
const expenses = require("./models/expense");
const orders = require('./models/orders');

const app = express();

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase")
const indexRoutes = require("./routes/index");

app.use(bodyparser.json({ extended: false }));
indexRoutes;
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes)
app.use(indexRoutes);

user.hasMany(expenses);
expenses.belongsTo(user);

user.hasMany(orders);
orders.belongsTo(user);

sequelize
  .sync()
  //.sync({ force: true }) //it syncs our models to the database by creating the appropriate tables and relations if we have them
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
