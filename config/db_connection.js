const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'aventuras-pr.cofqjrqev8bk.us-east-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'aventura31',
    database: 'aventuraspr'
});

module.exports = pool;