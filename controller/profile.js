const { exec, escape } = require('../db/mysql');

const getUserName = (uid) => {
    const sql = `select username
                    from users
                    where uid = ${uid};`
    return exec(sql).then(rows => {
        return rows[0];
    })
}

module.exports = getUserName;