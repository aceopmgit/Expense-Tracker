const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const user = require("../models/user.js");
const sequelize = require('../util/database.js')


exports.signup = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "signup.html"));
};

exports.login = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "login.html"));
};

function isStringInvalid(string) {
  if (string === undefined || string.length === 0) {
    return true
  }
  else {
    return false
  }
}

function generateAccessToken(id, name, premium) {
  return jwt.sign({ userId: id, name: name, premium: premium }, process.env.TOKEN_SECRET);
}

exports.addUser = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const name = req.body.Name;
    const email = req.body.Email;
    const password = req.body.Password;

    let userExist = await user.findOne({
      where: {
        Email: email
      }
    })

    if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ status: false, message: 'Bad Parameter. Something is Misssing !' });
    }

    if (!userExist) {
      bcrypt.hash(password, 10, async (err, hash) => {
        console.log(err);

        const data = await user.create({
          Name: name,
          Email: email,
          Password: hash,
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ status: true, message: "User Signed Up Successfully" });
      });
    }
    else {
      res.status(409).json({ message: 'Email or Phone Number already exist!' });
    }


  } catch (err) {
    await t.rollback()
    res.status(500).json({
      Error: err,
    });
  }
};

exports.loginCheck = async (req, res, next) => {
  try {
    const email = req.body.Email;
    const password = req.body.Password;

    if (isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ status: false, message: 'Bad Parameter. Something is Misssing !' });
    }

    const loginDetail = await user.findAll({ where: { Email: email } });
    if (loginDetail.length > 0) {
      bcrypt.compare(password, loginDetail[0].Password, (err, result) => {
        if (result === true) {
          res.status(200).json({
            success: true,
            message: "User Logged in Successfully !",
            token: generateAccessToken(loginDetail[0].id, loginDetail[0].Name, loginDetail[0].Premium),
          });
        } else {
          res
            .status(400)
            .json({ success: false, message: "Incorrect Password !" });
        }
      });
    } else {
      res.status(404).json({ success: false, message: "User not Found" });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

exports.getTotal = async (req, res, next) => {
  const details = await user.findOne({ where: { id: req.user.id }, attributes: ['Total'] });


  res.status(201).json({ succes: true, total: details.Total, });
}
