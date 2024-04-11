const env = process.env.NODE_ENV;    // 环境变量

let MYSQL_CONF;
let REDIS_CONF;

if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'MySQL_user',
        password: 'password',
        port: '3306',
        database: 'MySQL_database_name'
    }
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

if (env === 'production') {
    MYSQL_CONF = {
        host: 'MySQL_host',
        user: 'MySQL_user',
        password: 'password',
        port: '3306',
        database: 'MySQL_database_name'
    }
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

module.exports = { MYSQL_CONF, REDIS_CONF }