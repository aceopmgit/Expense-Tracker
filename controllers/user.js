const path=require('path')
const rootdir=require('../util/path.js');
const e = require('express');

exports.signup=(req,res,next)=>{    
    res.sendFile(path.join(rootdir,'views','user','signup.html'));
}

exports.addUser=async(req,res,next)=>{
    try{
        const name=req.body.Name;
        const email=req.body.Email
        const password=req.body.Password;
        const data={
            Name:name,
            Email:email,
            Password:password
        }
        res.status(201).json({newUserDetail:data});
        
    
    }
    catch(err){
        res.status(500).json({
            Error:err
        })
    }
}