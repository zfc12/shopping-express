var express = require('express');
const loginCheck  = require('../middleware/loginCheck');
const { getNearestStore } = require('../middleware/getNearestStore');
const { getNearbyStores, getStoreInfo, getBannerList, getCategoryList, getWhatsNewList, getDiscountList } = require('../controller/home');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { createHomeResModel } = require('../model/homeResModel');

var router = express.Router();

router.post('/', loginCheck, getNearestStore, function (req, res, next) {
    const storeId = req.session.store_id;
    Promise.all([getStoreInfo(storeId), getBannerList(storeId), getCategoryList(), getWhatsNewList(storeId), getDiscountList(storeId)]).then((values) => {
        const [storeInfo, bannerList, categoryList, whatsnewList, discountList] = values;
        res.json(new SuccessModel(createHomeResModel(storeInfo, bannerList, categoryList, whatsnewList, discountList)));
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
});


router.post('/nearby', loginCheck, function (req, res, next) {
    const {latitude, longitude} = req.body;
    getNearbyStores(latitude, longitude).then(data => {
        res.json(new SuccessModel(data));
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
});




module.exports = router;
