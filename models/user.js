const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const user = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  Name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  Password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = user;