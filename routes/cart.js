var express = require('express');
const loginCheck  = require('../middleware/loginCheck');
const { getCartTotalCount, getCartProductCount, addToCart, getCartList, submitCart, deleteProduct } = require('../controller/cart');
const { SuccessModel, ErrorModel } = require('../model/resModel');


var router = express.Router();

router.get('/count', loginCheck, function (req, res, next) {
    const uid = req.session.uid;
    const storeId = req.session.store_id;
    const { catId, productId } = req.query;

    Promise.all([getCartTotalCount(uid), getCartProductCount(uid, storeId, catId, productId)]).then(values => {
        const [item1, item2] = values;
        res.json(new SuccessModel({totalCount: item1.totalCount, productCount: item2.count}));
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
});


router.post('/add', loginCheck, function (req, res, next) {
    const uid = req.session.uid;
    const storeId = req.session.store_id;
    const { catId, productId, count } = req.body;

    addToCart(uid, storeId, catId, productId, count).then(() => {
        res.json(new SuccessModel())
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
});

router.get('/list', loginCheck, function (req, res, next) {
    const uid = req.session.uid;

    getCartList(uid).then(values => {
        let responseData = [];
        values.forEach((item) => {      // item: { shopId: xxx, shopName: xxx, catId: xxx, productId: xxx, ... }
            if (responseData.length == 0 || responseData.slice(-1)[0].shopId !== item.shopId) {
                const { shopId, shopName, catId, productId, count, imgUrl, weight, title, price, ordered } = item;
                const dataItem = {shopId, shopName, cartList: [{catId, productId, imgUrl, weight, title, price, count, ordered}]}
                responseData.push(dataItem);
            } else {
                const dataItem = responseData.slice(-1)[0];
                const { catId, productId, count, imgUrl, weight, title, price, ordered } = item;
                dataItem.cartList.push({catId, productId, imgUrl, weight, title, price, count, ordered});
            }
        })
        res.json(new SuccessModel(responseData));
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
});


router.post('/delete', loginCheck, function (req, res, next) {
    const uid = req.session.uid;
    const { storeId, catId, productId} = req.body;

    deleteProduct(uid, storeId, catId, productId).then(() => {
        res.json(new SuccessModel())
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
})


// router.post('/update-count', loginCheck, function (req, res, next) {
//     const uid = req.session.uid;
//     const { shopId:storeId, catId, productId, count } = req.body;

//     updateCount(uid, storeId, catId, productId, count).then(() => {
//         res.json(new SuccessModel())
//     }).catch(error => {
//         res.json(new ErrorModel(error));
//     })
// });


router.post('/submit', loginCheck, function (req, res, next) {
    const uid = req.session.uid;
    const data = req.body.map((item) => {
        return {
            uid,
            ...item
        }
    })

    submitCart(data).then(() => {
        res.json(new SuccessModel({orderId: Date.now()}))
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
});


module.exports = router;