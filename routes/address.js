var express = require('express');
const loginCheck  = require('../middleware/loginCheck');
const checkExistDefaultAddress = require('../middleware/checkExistDefaultAddress');
const { getAddress, getAddressList, addAddress, editAddress, deleteAddress } = require('../controller/address');
const { SuccessModel, ErrorModel } = require('../model/resModel');

var router = express.Router();


router.get('/', loginCheck, function (req, res, next) {
    const uid = req.session.uid;
    const { addressId } = req.query;

    getAddress(uid, addressId).then(data => {
        const { name, phone, address, isDefault } = data;
        const isDefaultBoolean = isDefault ? true : false;
        const data1 = { name, phone, address, isDefault: isDefaultBoolean };
        res.json(new SuccessModel(data1));
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
})


router.get('/list', loginCheck, function (req, res, next) {
    const uid = req.session.uid;

    getAddressList(uid).then(data => {
        const data1 = data.map(item => {
            const { id, name, phone, address, isDefault } = item;
            const isDefaultBoolean = isDefault ? true : false;
            return { id, name, phone, address, isDefault: isDefaultBoolean }
        })
        res.json(new SuccessModel(data1));
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
})

router.post('/add', loginCheck, function (req, res, next) {
    const uid = req.session.uid;
    const addressId = Date.now();
    const { name, phone, address, isDefault } = req.body;

    addAddress(uid, addressId, name, phone, address, isDefault).then(() => {
        res.json(new SuccessModel());
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
})


router.post('/edit', loginCheck, checkExistDefaultAddress, function (req, res, next) {
    const uid = req.session.uid;
    const { addressId, name, phone, address, isDefault } = req.body;

    editAddress(uid, addressId, name, phone, address, isDefault).then(() => {
        res.json(new SuccessModel());
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
})


router.post('/delete', loginCheck, function (req, res, next) {
    const uid = req.session.uid;
    const { addressId, isDefault } = req.body;

    deleteAddress(uid, addressId, isDefault).then(() => {
        return getAddressList(uid);
    }).then(data => {
        const data1 = data.map(item => {
            const { id, name, phone, address, isDefault } = item;
            const isDefaultBoolean = isDefault ? true : false;
            return { id, name, phone, address, isDefault: isDefaultBoolean }
        })
        res.json(new SuccessModel(data1));
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
})


module.exports = router;