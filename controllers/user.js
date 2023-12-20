const path = require("path");
const rootdir = require("../util/path.js");

const user = require("../models/user.js");

exports.signup = (req, res, next) => {
  res.sendFile(path.join(rootdir, "views", "user", "signup.html"));
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
