const express = require("express");

const expenseController = require("../controllers/expense");

const router = express.Router();

router.get("/enterExpense", expenseController.expense);

router.post("/addExpense", expenseController.addExpense);

router.get("/getExpense", expenseController.getExpense);

router.delete("/deleteExpense/:id", expenseController.deleteExpense);

//router.post("/addUser", userController.addUser);

//router.post("/loginCheck", userController.loginCheck);

module.exports = router;
