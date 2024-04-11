var express = require('express');
const loginCheck  = require('../middleware/loginCheck');
const getProductDetail = require('../controller/detail');
const { SuccessModel, ErrorModel } = require('../model/resModel');

var router = express.Router();

router.get('/', loginCheck, function (req, res, next) {
    const storeId = req.session.store_id;
    const { catId, productId } = req.query;
    getProductDetail(storeId, catId, productId).then(data => {
        res.json(new SuccessModel(data));
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
});


module.exports = router;