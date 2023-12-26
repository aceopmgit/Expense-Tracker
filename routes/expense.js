const express = require("express");
const userAuthenticate = require('../controllers/Authenticate')

const expenseController = require("../controllers/expense");

const router = express.Router();

router.get("/enterExpense", expenseController.expense);

router.post("/addExpense", userAuthenticate.authenticate, expenseController.addExpense);

router.get("/getExpense", userAuthenticate.authenticate, expenseController.getExpense);

router.delete("/deleteExpense/:id", userAuthenticate.authenticate, expenseController.deleteExpense);

module.exports = router;
