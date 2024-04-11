const { exec, escape } = require('../db/mysql');
const { genPassword } = require('../utils/cryp');
const xss = require('xss');

const login = (phone, password) => {
    const phone1 = escape(phone);
    const passwordTmp = genPassword(password);
    const password1 = escape(passwordTmp);

    let sql = `select uid, username from users where phone=${phone1} and password=${password1};` 
    return exec(sql).then(rows => {
        return rows[0];
    })
}

const register = (username, password, phone) => {
    const username1 = escape(xss(username));
    const password1 = escape(xss(genPassword(password)));
    const phone1 = escape(xss(phone));

    let sql = `insert into users(username, password, phone) VALUES(${username1}, ${password1}, ${phone1});`
    return exec(sql);
}

module.exports = { login, register }

