const { exec, escape } = require('../db/mysql');

const getNearestStoreInfo = (latitude, longitude) => {
    const latitude1 = parseFloat(latitude);
    const longitude1 = parseFloat(longitude);

    const sql = `SELECT store_id,
    round(
        6371 * 2 * asin(
            sqrt(
                pow(
                    sin(
                        (
                            ${latitude1} * PI() / 180 - latitude * PI() / 180
                        ) / 2
                    ),
                    2
                ) + cos(${latitude1} * PI() / 180) * cos(latitude * PI() / 180) * pow(
                    sin(
                        (
                            ${longitude1} * PI() / 180 - longitude * PI() / 180
                        ) / 2
                    ),
                    2
                )
            )
        )
    ) as distance
    FROM stores
    order by distance
    limit 1;`

    return exec(sql).then(rows => {
        return rows[0];
    })
}

const getNearbyStores = (latitude, longitude) => {
    const latitude1 = parseFloat(latitude);
    const longitude1 = parseFloat(longitude);

    const sql = `SELECT store_id as id, store_name as name, contact_phone as phone, address, latitude, longitude,
    round(
        6371 * 2 * asin(
            sqrt(
                pow(
                    sin(
                        (
                            ${latitude1} * PI() / 180 - latitude * PI() / 180
                        ) / 2
                    ),
                    2
                ) + cos(${latitude1} * PI() / 180) * cos(latitude * PI() / 180) * pow(
                    sin(
                        (
                            ${longitude1} * PI() / 180 - longitude * PI() / 180
                        ) / 2
                    ),
                    2
                )
            )
        ), 1
    ) as distance
    FROM stores
    order by distance
    limit 5;`

    return exec(sql);
}


const getStoreInfo = (storeId) => {
    const sql = `select store_id as id, store_name from stores where store_id = ${storeId};`;
    return exec(sql).then(rows => {
        return rows[0];
    })
}

const getBannerList = (storeId) => {
    const sql = `select banner_id as id, imgUrl
                    from banners
                    where store_id = ${storeId};`
    return exec(sql);
}

const getCategoryList = () => {
    const sql = `select cat_id as id, name, imgUrl from categorys where imgUrl IS NOT NULL;`
    return exec(sql);
}

const getWhatsNewList = (storeId) => {
    const sql = `select p.cat_id as catId, p.product_id as id, p.title, p.imgUrl, p.price
                    from whatsnews as w, products as p
                    where w.store_id = ${storeId} and p.store_id = w.store_id and
                            p.cat_id = w.cat_id and p.product_id = w.product_id;`
    return exec(sql);
}

const getDiscountList = (storeId) => {
    const sql = `select p.cat_id as catId, p.product_id as id, p.title, p.imgUrl, p.price
                    from discounts as d, products as p
                    where d.store_id = ${storeId} and p.store_id = d.store_id and
                            p.cat_id = d.cat_id and p.product_id = d.product_id;`
    return exec(sql);
}

module.exports = { getNearestStoreInfo, getNearbyStores, getStoreInfo, getBannerList, getCategoryList, getWhatsNewList, getDiscountList }