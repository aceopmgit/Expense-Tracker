const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const download = sequelize.define('download', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    Name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Url: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = download;