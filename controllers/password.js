const { createTransport } = require('nodemailer');
const uuid = require('uuid');
require('dotenv').config();
const path = require("path");
const bcrypt = require('bcrypt');

const User = require('../models/user');
const fPassword = require('../models/forgotPassword');
const sequelize = require('../util/database.js');
const { where } = require('sequelize');


exports.forgotpassword = async (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "views", "forgotPassword.html"));
}

exports.resetEmail = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {


        const user = await User.findOne({ where: { Email: req.body.email }, attributes: ['id', 'Name'] });

        if (user) {
            const id = uuid.v4();
            await fPassword.create({ id, isActive: true, userId: user.id }, { transaction: t })

            const transporter = createTransport({
                host: 'smtp-relay.sendinblue.com',
                port: 587,
                auth: {
                    user: 'ace.opm.sales@gmail.com',
                    pass: process.env.EMAIL_API_KEY
                }
            })
            const mailOptions = {
                from: 'ace.opm.sales@gmail.com',
                to: req.body.email,
                subject: 'Reset Password',
                html: `<P>Here is your reset link</P>
                <a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                } else {
                    res.status(201).json({ message: 'Link to reset password sent to your mail ', sucess: true });
                    console.log('Email Sent' + info.response)
                }
            })
            await t.commit();

        } else {
            throw new Error('User not Found !')
        }
    } catch (err) {
        await t.rollback()
        console.log('*********************************************************' + err)
        res.status(404).json({ message: `${err}`, sucess: false });
    }
};


exports.resetpassword = async (req, res, next) => {
    try {
        const id = req.params.id;
        const rPassword = await fPassword.findOne({ where: { id } });
        console.log('******************************', rPassword)
        if (rPassword && rPassword.isActive === true) {
            rPassword.update({ isActive: false })
            res.status(200).send(`<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Forgot Password</title>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css"
                    integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" />
            </head>
            
            <body style="background-color: #eef76c">
                <nav class="navbar navbar-expand-lg navbar-primary" style="background-color: #9e400abe">
                    <div class="container-fluid">
                        
                            <h1>Expense Tracker</h1>
                        
                    </div>
                </nav>
            
                <div class="row">
                    <div class="col-sm-12 col-md-6 mx-auto">
                        <div class="container">
                            <br />
                            <br />
            
                            <div class="card" style="background-color: #eef891">
                                <div class="card-body">
                                    <h2 class="card-title">Reset Password</h2>
            
                                    <form id="resetForm">

                                        <div class="form-floating">
                                            <input type="password" id="newpassword"  name="newpassword" class="form-control" placeholder="newPassword"
                                                required />
                                            <label for="newpassword" class="form-label">Enter new Password</label>
                                            <br />
                                        </div>
            
            
                                        <button class="btn btn-primary float-right" type="submit">Confirm</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
                <br />
                <br />
                <script>
                const resetPassword = document.getElementById("resetForm");
                resetPassword.addEventListener("submit", reset);

                async function reset(e) {
                    try {
                        e.preventDefault()
                        let newpassword = document.getElementById("newpassword").value;
                
                        const details = {
                            newpassword
                        }
                
                        const res = await axios.post("/password/updatepassword/${id}", details)
                        alert(res.data.message);
                        window.location.href = "/user/login";
                        
                    } catch (err) {
                        console.log(err)
                        //alert(err)                        
                    }
                }

                </script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.0/axios.min.js"></script>
            

            </body>
            
            </html>`
            )
            res.end();
        } else {
            throw new Error('Invalid Request !')
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: `${err}`, sucess: false });
    }

}

exports.updatepassword = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {

        const { newpassword } = req.body;

        const { resetPasswordId } = req.params;

        const reset = await fPassword.findOne({ where: { id: resetPasswordId } });

        const user = await User.findOne({ where: { id: reset.userId } })
        if (user) {

            bcrypt.hash(newpassword, 10, async (err, hash) => {
                if (err) {
                    //console.log('*************************************************', newPassword, salt)
                    console.log(err);
                    throw new Error(err);
                }

                await user.update({
                    Password: hash,
                }, { transaction: t });

                await t.commit();
                res.status(201).json({ status: true, message: "User Password reset successfull" });
            });
        }
        else {
            return res.status(404).json({ error: 'No user Exists', success: false })
        }

    }
    catch (err) {
        await t.rollback()
        console.log(err)
        return res.status(403).json({ err, success: false })
    }

}