const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");

const sequelize = require("./util/database");
const user = require("./models/user");
const expense = require("./models/expense");

const app = express();

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const indexRoutes = require("./routes/index");

app.use(bodyparser.json({ extended: false }));
indexRoutes;
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use(indexRoutes);

user.hasMany(expense);
expense.belongsTo(user, { contraints: true, onDelete: 'CASCADE' });

sequelize
  .sync()
  //.sync({ force: true }) //it syncs our models to the database by creating the appropriate tables and relations if we have them
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
