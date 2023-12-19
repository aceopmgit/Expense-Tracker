const express=require('express');
const bodyparser=require('body-parser');

const sequelize=require('./util/database');


const app=express();

const userRoutes=require('./routes/user');


app.use(bodyparser.json({extended:false}))

app.use('/user',userRoutes);

app.listen(3000);


