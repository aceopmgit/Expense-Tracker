const path = require("path");

const expense = require("../models/expense.js");
const sequelize = require('../util/database.js')

exports.expense = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "expense.html"));
};

function isStringInvalid(string) {
  if (string === undefined || string.length === 0) {
    return true
  }
  else {
    return false
  }
}

exports.addExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { amount, description, category } = req.body;

    if (isStringInvalid(amount) || isStringInvalid(description) || isStringInvalid(category)) {
      return res.status(400).json({ status: false, message: 'Bad Parameter. Something is Misssing !' });
    }

    const data = await expense.create({
      Amount: amount,
      Description: description,
      Category: category,
      userId: req.user.id
    }, { transaction: t });

    const total = Number(req.user.Total) + Number(amount);
    await req.user.update({ Total: total }, { transaction: t });

    await t.commit();

    res.status(201).json({ expenseDetails: data });
  } catch (err) {

    await t.rollback()
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
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const d = await expense.findOne({ where: { id: id }, attributes: ['Amount'] }, { transaction: t });

    const total = Number(req.user.Total) - Number(d.Amount);
    await req.user.update({ Total: total }, { transaction: t });

    await expense.destroy({ where: { id: id, userId: req.user.id } }, { transaction: t });

    res.sendStatus(200);
  } catch (err) {
    await t.rollback()
    res.status(500).json({
      Error: err,
    });
  }
};
