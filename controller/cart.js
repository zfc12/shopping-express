const { exec, escape } = require('../db/mysql');

const getCartTotalCount = (uid) => {
    const sql = `select count(*) as totalCount
                    from carts
                    where uid = ${uid};`
    return exec(sql).then(rows => {
        return rows[0];
    })
}

const getCartProductCount = (uid, storeId, catId, productId) => {
    const sql = `SELECT 
                    IF(COUNT(*) > 0, count, 0) AS count
                FROM 
                    carts
                WHERE 
                    uid = ${uid} AND 
                    store_id = ${storeId} AND 
                    cat_id = ${catId} AND 
                    product_id = ${productId};`
    return exec(sql).then(rows => {
        return rows[0];
    })
}


const addToCart = (uid, storeId, catId, productId, count) => {
    const count1 = escape(count);
    const sql = `INSERT INTO carts (uid, store_id, cat_id, product_id, count, ordered)
                    VALUES (${uid}, ${storeId}, ${catId}, ${productId}, ${count1}, FALSE)
                    ON DUPLICATE KEY UPDATE count = VALUES(count);`
    return exec(sql);
}


const getCartList = (uid) => {
    const sql = `select c.store_id as shopId, s.store_name as shopName, c.cat_id as catId, c.product_id as productId, c.count, p.imgUrl, p.spec as weight, p.title, p.price, c.ordered
                    from carts as c, products as p, stores as s
                    where c.uid = ${uid} and c.store_id = p.store_id and c.cat_id = p.cat_id and c.product_id = p.product_id and
                    c.store_id = s.store_id
                    order by c.store_id;`;
    return exec(sql);
}


// const updateCount = (uid, storeId, catId, productId, count) => {
//     const sql = `update carts
//                     set count = ${count}
//                     where uid = ${uid} and store_id = ${storeId} and cat_id = ${catId} and product_id = ${productId};`;
//     return exec(sql);
// }


const deleteProduct = (uid, storeId, catId, productId) => {
    const sql = `delete from carts as c
                    where c.uid = ${uid} and c.store_id = ${storeId} and c.cat_id = ${catId} and c.product_id = ${productId};`
    return exec(sql);
}





// Type of the passed in parameter 'data' is: Array<{uid, storeId, catId, productId, count}>
// The passed-in parameter 'data' has been checked to be non-empty

const submitCart = (data) => {
    let sqlStatement = `insert into carts (uid, store_id, cat_id, product_id, count, ordered)
                        VALUES `;
    let valueStr = '';
    data.forEach((item) => {
        const sql = `(${item.uid}, ${item.storeId}, ${item.catId}, ${item.productId}, ${item.count}, TRUE) `
        valueStr += sql;
    })
    const newValueStr = valueStr.replace(/\) \(/g, '), (');
    sqlStatement += newValueStr;
    sqlStatement += `
                    ON DUPLICATE KEY UPDATE count = VALUES(count), ordered = VALUES(ordered);`


    let sqlStatement2 = `UPDATE carts 
    SET ordered = FALSE 
    WHERE uid = ${data[0].uid} 
    AND (store_id, cat_id, product_id) NOT IN (
        SELECT store_id, cat_id, product_id 
        FROM (VALUES `;

    let valueStr2 = ''
    data.forEach((item) => {
        const sql = `ROW(${item.storeId}, ${item.catId}, ${item.productId}) `
        valueStr2 += sql;
    })
    const newValueStr2 = valueStr2.replace(/\) ROW\(/g, '), ROW(');
    sqlStatement2 += newValueStr2;
    
    sqlStatement2 += `) AS arr1(store_id, cat_id, product_id)
    );`
            
    return exec(sqlStatement).then(() => {
        return exec(sqlStatement2);
    })
}



// const submitCart = (data) => {
//     let sqlStatement = '';
//     data.forEach((item) => {
//         const sql = `update carts
// set count = ${item.count}, ordered = TRUE
// where uid = ${item.uid} and store_id = ${item.storeId} and cat_id = ${item.catId} and product_id = ${item.productId};
// `
//         sqlStatement += sql;
//     })
//     console.log(sqlStatement);
//     return exec(sqlStatement);
// }


module.exports = { getCartTotalCount, getCartProductCount, addToCart, getCartList, submitCart, deleteProduct }

