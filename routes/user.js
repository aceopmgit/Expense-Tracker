const express = require("express");

const userController = require("../controllers/user");
const userAuthenticate = require('../controllers/Authenticate')

const router = express.Router();

router.get("/signup", userController.signup);

router.get("/login", userController.login);

router.post("/addUser", userController.addUser);

router.post("/loginCheck", userController.loginCheck);

//router.post("/updateTotal", userAuthenticate.authenticate, userController.updateTotal);

module.exports = router;
