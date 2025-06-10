// Javascript file that establishes a connection to the database

// Citation for the following code block:
// Date: 05/20/2025
// Adapted from Exploration - Web Application Technology and Exploration
// Source URL: https://oregonstate.instructure.com/courses/1999601/pages/exploration-web-application-technology-2

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
