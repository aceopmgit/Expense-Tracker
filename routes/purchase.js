const express = require("express");
const userAuthenticate = require('../controllers/Authenticate')

const purchaseController = require("../controllers/purchase");

const router = express.Router();

router.get("/premiumMembership", userAuthenticate.authenticate, purchaseController.purchasePremium);

router.post("/updateTransaction", userAuthenticate.authenticate, purchaseController.updateTransaction);

router.get("/premiumCheck", userAuthenticate.authenticate, purchaseController.premiumCheck);


module.exports = router;
