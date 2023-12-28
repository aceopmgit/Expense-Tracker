const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const user = require("../models/user.js");

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

function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name: name }, process.env.TOKEN_SECRET);
}

exports.addUser = async (req, res, next) => {
  try {
    const name = req.body.Name;
    const email = req.body.Email;
    const password = req.body.Password;

    if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ status: false, message: 'Bad Parameter. Something is Misssing !' });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      console.log(err);

      const data = await user.create({
        Name: name,
        Email: email,
        Password: hash,
      });

      res
        .status(201)
        .json({ status: true, message: "User Signed Up Successfully" });
    });
  } catch (err) {
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
            token: generateAccessToken(loginDetail[0].id, loginDetail[0].Name),
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
