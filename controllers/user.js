const path = require("path");
const rootdir = require("../util/path.js");

const user = require("../models/user.js");
const { where } = require("sequelize");

exports.signup = (req, res, next) => {
  res.sendFile(path.join(rootdir, "views", "user", "signup.html"));
};

exports.login = (req, res, next) => {
  res.sendFile(path.join(rootdir, "views", "user", "login.html"));
};

exports.addUser = async (req, res, next) => {
  try {
    const name = req.body.Name;
    const email = req.body.Email;
    const password = req.body.Password;
    const data = await user.create({
      Name: name,
      Email: email,
      Password: password,
    });
    res.status(201).json({ newUserDetail: data });
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

    const loginDetail = await user.findOne({ where: { Email: email } });
    if (loginDetail.Password === password) {
      res.status(200).json({ message: "User Logged in Successfully" });
    }
  } catch (err) {
    res.status(500).json({
      Error: err,
    });
  }
};
