const mysql = require('mysql');
const { query } = require('express');

var pool = mysql.createPool({
    // "user" : 'root',
    // "password" : 'cdwq8i9o',
    // "database" : 'idelivery',
    // "host" : 'localhost',
    // "port" : '3306'
    "connectionLimit"   :   1000,
    "user"              :   process.env.MYSQL_USER,
    "password"          :   process.env.MYSQL_PASSWORD,
    "database"          :   process.env.MYSQL_DATABASE,
    "host"              :   process.env.MYSQL_HOST,
    "port"              :   process.env.MYSQL_PORT
});
// process.env.MYSQL_PORT // - verificar arquivo nodemon.json

exports.execute = (query, params=[]) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, result, fields) => {
                    // conn.release(); // neste caso não precisausar
                    if (error){
                        reject(error);
                    }else{
                        resolve(result);
                    }
        });
    })
}


exports.pool = pool;