const express = require('express')
var moment = require('moment');
const router = express.Router()

var Expense = require("../model/Expense")
var expenseJSON = require("../../expenses")

expenseJSON.forEach(expenseObj => {
    let expense = new Expense({
        name: expenseObj.item,
        amount: expenseObj.amount,
        date: expenseObj.date,
        group: expenseObj.group
    })
    expense.save()
})

const getDate = date => {
    if (date == null) {
        return moment().format('LLLL')
    } else {
        return moment(date).format('LLLL')
    }
}

router.get("/expenses", function (request, response) {
    Expense.find({})
        .sort({ date: -1 })
        .exec(function (err, expenses) {
            console.log(expenses)
            response.send(expenses)
        })
})

router.post("/expense", function (request, response) {
    const data = request.body

    let expense = new Expense({
        name: data.name,
        amount: data.amount,
        group: data.group,
        date: getDate(data.date)
    })

    console.log("expense: ", expense)

    const expensePromise = expense.save()
    expensePromise.then(function (expense) {
        console.log(`The amount of expense is ${expense.amount} 
                    and you spent your money on ${expense.group}`)
    })
    response.send(`New expense was inserted -> ${expense}`)
})

router.put("/update/:group1/:group2", function (request, response) {
    const group1 = request.params.group1
    const group2 = request.params.group2
    Expense.findOneAndUpdate({ group: group1 }, { group: group2 }, { new: true })
        .exec(function (err, expense) {
            console.log(expense)
            response.send(`The ${expense.name} expense changed , to ${expense.group} group`)
        })
})

router.get("/expenses/:group", function (request, response) {
    const groupData = request.params.group

    Expense.find({ group: groupData })
        .exec(function (err, expenses) {
            response.send(`All expenses per a specific category founded ${expenses}`)
        })
})

router.get("/expenses/aggregate/:group", function (request, response) {
    const { groupData } = request.params
    const { total } = request.body

    if (Boolean(total)) {
        Expense.aggregate([
            {
                $group: {
                    _id: grou
                }
            }
        ])
    }
})

module.exports = router