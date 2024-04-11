const { exec, escape } = require('../db/mysql');


const getUserAddress = (uid) => {
    const sql = `select address_id as id, contact_name as name, contact_phone as phone, address 
                    from useraddresses
                    where uid = ${uid} and is_default = TRUE;`
    return exec(sql).then(rows => {
        return rows[0];
    })
}

const getUserAddressList = (uid) => {
    const sql = `select address_id as id, contact_name as name, contact_phone as phone, address 
                    from useraddresses
                    where uid = ${uid};`;
    return exec(sql);
}

const getOrder = (uid) => {
    const sql = `select c.store_id as shopId, s.store_name as shopName, c.product_id as productId, c.count, p.imgUrl, p.spec as weight, p.title, p.price
                    from carts as c, products as p, stores as s
                    where c.uid = ${uid} and c.store_id = p.store_id and c.cat_id = p.cat_id and c.product_id = p.product_id and
                    c.store_id = s.store_id and c.ordered = TRUE
                    order by c.store_id;`;
    return exec(sql);
}


const submitCart = (uid) => {
    const sql1 = `INSERT INTO products (store_id, cat_id, product_id, sales)
                    SELECT store_id, cat_id, product_id, count
                    FROM carts
                    WHERE uid = ${uid} AND ordered = TRUE
                    ON DUPLICATE KEY UPDATE sales = sales + VALUES(sales);`;
    
    const sql2 = `delete from carts
                    where uid = ${uid} and ordered = TRUE;`

    return exec(sql1).then(() => {
        return exec(sql2);
    });
}




module.exports = { getUserAddress, getUserAddressList, getOrder, submitCart }