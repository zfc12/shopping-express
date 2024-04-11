const mysql = require('mysql');
const {MYSQL_CONF} = require('../config/db');

const connection = mysql.createConnection(MYSQL_CONF);

connection.connect(function(err) {
    if (err) throw err;
    console.log("MySQL database connected");
});

// 统一执行 sql 的函数
function exec(sql) {
    const promise = new Promise ((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        })
    })
    return promise;
}

module.exports = { exec, escape: mysql.escape }