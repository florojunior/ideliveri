const mysql = require('mysql');

var pool = mysql.createPool({
    "user" : 'root',//process.env.MYSQL_USER,
    "password" : 'cdwq8i9o',//process.env.MYSQL_PASSWORD,
    "database" : 'idelivery',//process.env.MYSQL_DATABASE,
    "host" : 'localhost',//process.env.MYSQL_HOST,
    "port" : '3306'//process.env.MYSQL_PORT
});
//process.env.MYSQL_PORT - verificar arquivo nodemon.json
exports.pool = pool;