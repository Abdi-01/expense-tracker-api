const express = require('express');
const fs = require('fs');
const { type } = require('os');
const PORT = 5555; // PORT yg jangan dipakai : 3306, 80, 443, 1080
const app = express();
app.use(express.json()); // membaca req.body

app.get('/', (request, response) => {
    response.status(200).send('<h1>Welcome to Expense Tracker API</h1>')
});

const expenseRoute = require('./routers/expenseRouter');
// Manage request for expense data
app.use('/expense', expenseRoute);

// DB Check Connection
const { dbConf } = require('./config/db');
dbConf.getConnection((error, connection) => {
    if (error) {
        console.log("Error MySQL Connection", error.sqlMessage);
    }
    console.log("Connect MySQL ✅", connection.threadId);
});
app.listen(PORT, () => console.log("Expense Tracker API RUNNING", PORT));