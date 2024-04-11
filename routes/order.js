var express = require('express');
const loginCheck  = require('../middleware/loginCheck');
const { getUserAddress, getUserAddressList, getOrder, submitCart } = require('../controller/order');
const createOrderResModel = require('../model/orderResModel');
const { SuccessModel, ErrorModel } = require('../model/resModel');

var router = express.Router();

const getNextDayTime = () => {
    let currentDate = new Date();
    
    // Increment the date by 1 day
    currentDate.setDate(currentDate.getDate() + 1);

    // Format the date
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based in JavaScript
    let day = String(currentDate.getDate()).padStart(2, '0');

    // Concatenate to get the desired format
    return `${year}-${month}-${day} 09:00`;
};


router.get('/', loginCheck, function (req, res, next) {
    const uid = req.session.uid;

    Promise.all([getUserAddress(uid), getOrder(uid)]).then(values => {
        const [userAddress, orderList] = values;
        let shopList = [];
        let total = 0;
        orderList.forEach((item) => {      // item: { shopId: xxx, shopName: xxx, catId: xxx, productId: xxx, ... }
            if (shopList.length == 0 || shopList.slice(-1)[0].shopId !== item.shopId) {
                const { shopId, shopName, catId, productId, count, imgUrl, weight, title, price, ordered } = item;
                const dataItem = {shopId, shopName, cartList: [{catId, productId, imgUrl, weight, title, price, count, ordered}]}
                shopList.push(dataItem);
                total += price * count;
            } else {
                const dataItem = shopList.slice(-1)[0];
                const { catId, productId, count, imgUrl, weight, title, price, ordered } = item;
                dataItem.cartList.push({catId, productId, imgUrl, weight, title, price, count, ordered});
                total += price * count;
            }
        })
        total = total.toFixed(2);
        res.json(new SuccessModel(createOrderResModel(userAddress, getNextDayTime(), total, shopList)));
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
})


router.get('/address-list', loginCheck, function (req, res, next) {
    const uid = req.session.uid;

    getUserAddressList(uid).then(data => {
        res.json(new SuccessModel(data));
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
}) 


router.post('/submit', loginCheck, function (req, res, next) {
    const uid = req.session.uid;
    const { orderId, addressId, time, paymentType } = req.body;

    submitCart(uid).then(() => {
        res.json(new SuccessModel({trackingId: Date.now()}));
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
}) 




module.exports = router;