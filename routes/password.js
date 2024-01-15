const express = require("express");
const userAuthenticate = require('../controllers/Authenticate')

const passwordController = require("../controllers/password");

const router = express.Router();

router.get("/forgotPassword", passwordController.forgotpassword);

router.post('/resetEmail', passwordController.resetEmail)

router.get('/resetpassword/:id', passwordController.resetpassword)

router.post('/updatepassword/:resetPasswordId', passwordController.updatepassword)

module.exports = router;