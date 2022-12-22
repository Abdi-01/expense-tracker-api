const mysql = require('mysql');

const dbConf = mysql.createPool({
    host: 'localhost',
    user: 'AL',
    password: '007@001',
    database: 'expense_tracker',
    port: 3306
});

module.exports = { dbConf };