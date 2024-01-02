const express = require("express");
const userAuthenticate = require('../controllers/Authenticate')

const passwordController = require("../controllers/password");

const router = express.Router();

router.post("/forgotpassword", passwordController.forgotpassword);

module.exports = router;