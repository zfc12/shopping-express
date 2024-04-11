const { exec } = require('../db/mysql');

const getProductDetail = (storeId, categoryId, productId) => {
    const sql = `select product_id as id, cat_id, imgUrl, title, subtitle, price, sales, origin, spec as specification, detail
                    from products
                    where store_id = ${storeId}  and cat_id = ${categoryId} and product_id = ${productId};`;
    return exec(sql).then(rows => {
        return rows[0];
    })
}

module.exports = getProductDetail