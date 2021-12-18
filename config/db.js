const mysql = require('mysql');
 
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'adgjl30230@',
    database: 'reactboard'
});
 
module.exports = db;