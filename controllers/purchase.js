const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/user');
const Expense = require('../models/expense');
const e = require('express');
const jwt = require("jsonwebtoken");
const sequelize = require('sequelize');

function generateAccessToken(id, name, premium) {
    return jwt.sign({ userId: id, name: name, premium: premium }, process.env.TOKEN_SECRET);
}

exports.purchasePremium = async (req, res, next) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZOR_KEY_ID,
            key_secret: process.env.RAZOR_KEY_SECRET
        })

        const amount = 5000;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderId: order.id, status: 'PENDING' }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            }).catch((err) => {
                throw new Error(err)
            })
        })
    } catch (err) {
        console.log(err)
        res.status(403).json({
            message: 'Something went wrong !',
            Error: err
        })
    }

}

exports.updateTransaction = async (req, res, next) => {
    try {
        const { order_id, payment_id, status } = req.body
        console.log(req.body)
        const order = await Order.findOne({ where: { orderId: order_id } })

        if (status === 'SUCCESSFUL') {
            const promise1 = order.update({ paymentId: payment_id, status: status });
            const promise2 = req.user.update({ Premium: true });
            Promise.all([promise1, promise2]).then(() => {
                res.status(201).json({ success: true, message: 'Transaction Successfull', token: generateAccessToken(req.user.id, undefined, true) });
            }).catch((err) => {
                throw new Error(err);
            })
        }
        else {
            const promise1 = order.update({ paymentId: payment_id, status: status });
            const promise2 = req.user.update({ Premium: false });
            Promise.all([promise1, promise2]).then(() => {
                res.status(201).json({ success: false, message: 'Transaction Failed' });
            }).catch((err) => {
                throw new Error(err);
            })
        }
    } catch (err) {
        console.log(err)
        res.status(403).json({
            message: 'Something went wrong !',
            Error: err
        })

    }



}

//  exports.premiumCheck = async (req, res, next) => {
//  const details = await User.findOne({ where: { id: req.user.id } });
//   console.log(details.Premium)
//     res.status(201).json({ Premium: details.Premium });
// }


exports.showLeaderBoard = async (req, res, next) => {
    const details = await User.findAll({
        attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('Amount')), 'Total']],
        include: [{
            model: Expense,
            attributes: []
        }],
        group: ['user.id'],
        order: [
            ['Total', 'DESC']
        ]
    })


    res.status(201).json({ details: details });

}



