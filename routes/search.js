var express = require('express');
const loginCheck  = require('../middleware/loginCheck');
const { getSearchSuggestions, getShopSearchList } = require('../controller/search');
const { SuccessModel, ErrorModel } = require('../model/resModel');

var router = express.Router();

router.get('/', loginCheck, function (req, res, next) {
    const storeId = req.session.store_id;
    getSearchSuggestions(storeId).then(data => {
        const arr = data.map(obj => obj.keyword);
        res.json(new SuccessModel(arr));
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
});

router.get('/shop-search-list', loginCheck, function (req, res, next) {
    const { keyword, shopId:storeId, orderBy } = req.query;
    getShopSearchList(storeId, keyword, orderBy).then(data => {
        res.json(new SuccessModel(data));
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
});

module.exports = router;