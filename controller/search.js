const { exec, escape } = require('../db/mysql');

const getSearchSuggestions = (storeId) => {
    const sql = `select keyword from searchsuggestions where store_id = ${storeId};`

    return exec(sql);
}

const getShopSearchList = (storeId, keyword, orderBy) => {
    const keyword1 = escape('%' + keyword + '%');

    let sql = `select product_id as id, cat_id, imgUrl, title, price, sales
                    from products
                    where store_id = ${storeId} and title like ${keyword1}`;
    if (orderBy === 'default') {
        sql += ';';
    } else if (orderBy === 'by-price') {
        sql += ' order by price;';
    } else if (orderBy === 'by-sales') {
        sql += ' order by sales desc;'
    }
    return exec(sql);
}

module.exports = { getSearchSuggestions, getShopSearchList }