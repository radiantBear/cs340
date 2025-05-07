const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit: 10,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

module.exports = pool;
