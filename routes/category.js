var express = require('express');
const loginCheck  = require('../middleware/loginCheck');
const { getCategoryList, getPrimaryCategoryList, getAllProducts, getWhatsNewProducts, getDiscountsProducts, getProducts } = require('../controller/category');
const { createCategoryListResModel } = require('../model/categoryResModel');
const { SuccessModel, ErrorModel } = require('../model/resModel');

var router = express.Router();

router.get('/', loginCheck, function (req, res, next) {
    const storeId = req.session.store_id;

    Promise.all([getCategoryList(storeId), getPrimaryCategoryList()]).then(values => {
        const [categoryList, tagList] = values;
        res.json(new SuccessModel(createCategoryListResModel(categoryList, tagList)))
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
})



router.get('/product-list', loginCheck, function (req, res, next) {
    const storeId = req.session.store_id;
    const { keyword, category:currentCategory, tag:currentTag } = req.query;     // currentCategory: {id: string; name: string;}, currentTag: {id: string; name: string;}

    if (currentCategory.name === 'All') {
        getAllProducts(storeId, keyword, currentTag).then(data => {
            res.json(new SuccessModel(data));
        }).catch(error => {
            res.json(new ErrorModel(error));
        })
    } else if (currentCategory.name === 'What\'s new') {
        getWhatsNewProducts(storeId, keyword, currentTag).then(data => {
            res.json(new SuccessModel(data));
        }).catch(error => {
            res.json(new ErrorModel(error));
        })
    } else if (currentCategory.name === 'Discounts') {
        getDiscountsProducts(storeId, keyword, currentTag).then(data => {
            res.json(new SuccessModel(data));
        }).catch(error => {
            res.json(new ErrorModel(error));
        })
    } else {
        getProducts(storeId, keyword, currentCategory.id, currentTag).then(data => {
            res.json(new SuccessModel(data));
        }).catch(error => {
            res.json(new ErrorModel(error));
        })
    }
})



module.exports = router;