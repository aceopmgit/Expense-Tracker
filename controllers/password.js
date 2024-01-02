const { createTransport } = require('nodemailer');
require('dotenv').config();

function isStringInvalid(string) {
    if (string === undefined || string.length === 0) {
        return true
    }
    else {
        return false
    }
}

exports.forgotpassword = async (req, res, next) => {
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
        text: 'Here is your reset link'
    }

    //console.log('******************************************' + req.body.email);


    if (isStringInvalid(req.body.email)) {
        return res.status(400).json({ status: false, message: 'Bad Parameter. Something is Misssing !' });
    }


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log('Email Sent' + info.response)
        }
    })
    //console.log('******************************************' + req.body.email);
};