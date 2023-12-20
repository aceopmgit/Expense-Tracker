const {Sequelize}=require('sequelize');

const sequelize=new Sequelize('expense-tracker','root','Ace@1535',{
    dialect:'mysql',
    host:'localhost'
});

module.exports=sequelize;