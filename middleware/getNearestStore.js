const { getNearestStoreInfo } = require('../controller/home');


function getNearestStore(req, res, next) {
    const { latitude, longitude } = req.body;
    getNearestStoreInfo(latitude, longitude).then(data => {
        req.session.store_id = data.store_id;
        next();
    })
}

module.exports = { getNearestStore }