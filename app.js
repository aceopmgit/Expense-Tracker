const express = require("express");
const bodyparser = require("body-parser");

const sequelize = require("./util/database");

const app = express();

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");

app.use(bodyparser.json({ extended: false }));

app.use(express.static("public"));

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);

sequelize
  .sync()
  //.sync({ force: true }) //it syncs our models to the database by creating the appropriate tables and relations if we have them
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
