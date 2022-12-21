const route = require('express').Router();
const { getExpense, getDetail, addData, deleteData, total } = require('../controllers/expenseController');

route.get('/', getExpense);
route.get('/detail/:id', getDetail);
route.post('/', addData);
route.patch('/:id', addData);
route.delete('/:id', deleteData);
route.get('/total', total);

module.exports = route;