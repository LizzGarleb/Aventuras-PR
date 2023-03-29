
const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '31082004',
    database: 'aventuraspr'
});

module.exports = pool;