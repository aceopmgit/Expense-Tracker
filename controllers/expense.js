const path = require("path");
const AWS = require('aws-sdk');
require("aws-sdk/lib/maintenance_mode_message").suppress = true;


const expense = require("../models/expense.js");
const downloads = require("../models/downloads.js");
const sequelize = require('../util/database.js');

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
    const page = Number(req.query.page) || 1;

    const total = await expense.count();
    const limit = Number(req.query.limit) || total;
    //console.log('******************************', page)
    const details = await expense.findAll({
      where: { userId: req.user.id },
      offset: (page - 1) * limit,
      limit: limit,
      order: [
        ['createdAt', 'DESC']
      ]
    });
    //console.log('*********************************', details)
    //console.log('******************************', total)
    res.status(201).json({
      expenses: details,
      currentPage: page,
      hasNextPage: limit * page < total,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1
    });
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

    await t.commit();
    res.sendStatus(200);
  } catch (err) {
    await t.rollback()
    res.status(500).json({
      Error: err,
    });
  }
};

function uploadToS3(data, fileName) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3Bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  })


  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: 'public-read'
  }

  return new Promise((resolve, reject) => {
    s3Bucket.upload(params, (err, s3Response) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        //console.log('success', s3Response);
        resolve(s3Response.Location);
      }
    })
  })
}


exports.downloadExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const expenses = await req.user.getExpenses();
    //console.log(expenses)
    const stringExpenses = JSON.stringify(expenses)

    //file name should depend on userId and date of download
    const userId = req.user.id;

    const fileName = `Expense_${userId}_${new Date()}.Txt`;
    const fileUrl = await uploadToS3(stringExpenses, fileName);

    const data = await downloads.create({
      Name: fileName,
      Url: fileUrl,
      userId: req.user.id
    }, { transaction: t });

    await t.commit();

    console.log(data);
    res.status(200).json({ fileUrl, success: true })
  } catch (err) {
    await t.rollback()
    res.status(500).json({ fileUrl: '', success: false, Error: err });
  }
}

exports.downloadHistory = async (req, res, next) => {
  try {
    const downloads = await req.user.getDownloads({
      attributes: ['Name', 'Url', 'createdAt'],
      order: [
        ['createdAt', 'DESC']
      ],
    })
    res.status(201).json({ downloadList: downloads });
  } catch (err) {
    res.status(500).json({
      Error: err,
    });
  }
}
