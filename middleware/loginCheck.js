const { ErrorModel } = require('../model/resModel');

function loginCheck(req, res, next) {
    if (req.session.uid) {
        next()
    } else {
        res.status(403).json(new ErrorModel('未登录'));
    }
}

module.exports = loginCheck;