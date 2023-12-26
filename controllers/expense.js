const path = require("path");

const expense = require("../models/expense.js");

exports.expense = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "expense.html"));
};

exports.addExpense = async (req, res, next) => {
  try {
    const { amount, description, category } = req.body;

    const data = await expense.create({
      Amount: amount,
      Description: description,
      Category: category,
      userId: req.user.id
    });

    res.status(201).json({ expenseDetails: data });
  } catch (err) {
    res.status(500).json({
      Error: err,
    });
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const details = await expense.findAll({ where: { userId: req.user.id } });
    res.status(201).json({ allExpenseDetails: details });
  } catch (err) {
    res.status(500).json({
      Error: err,
    });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    await expense.destroy({ where: { id: id, userId: req.user.id } });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({
      Error: err,
    });
  }
};