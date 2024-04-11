const { existDefaultAddressCheck } = require('../controller/address');
const { ErrorModel } = require('../model/resModel');

function checkExistDefaultAddress(req, res, next) {
    const uid = req.session.uid;
    const { addressId, isDefault } = req.body;
    existDefaultAddressCheck(uid, addressId).then((data) => {
        if (data) {         // The user has set some default address
            next()
        }  else if (isDefault) {       // The address we are editing is the user's default address, but the user is not changing the default value
            next()
        } else {              // The address we are editing is the user's default address, and the user is changing the default value
            res.json(new ErrorModel('There must be a default address'))
        }
    }).catch(error => {
        res.json(new ErrorModel(error));
    })
}

module.exports = checkExistDefaultAddress;