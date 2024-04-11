var express = require('express');
const loginCheck  = require('../middleware/loginCheck');
const getUserName = require('../controller/profile');
const {SuccessModel, ErrorModel} = require('../model/resModel');

var router = express.Router();

router.get('/', loginCheck, function (req, res, next) {
    const uid = req.session.uid;

    getUserName(uid).then(data => {
        res.json(new SuccessModel(data));
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
})


module.exports = router;

