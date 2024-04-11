const { exec, escape } = require('../db/mysql');
const xss = require('xss');


const getAddress = (uid, addressId) => {
    const sql = `select contact_name as name, contact_phone as phone, address, is_default as isDefault
                    from useraddresses
                    where uid = ${uid} and address_id = ${addressId}`;
    return exec(sql).then(rows => {
        return rows[0];
    });
}


const getAddressList = (uid) => {
    const sql = `select address_id as id, contact_name as name, contact_phone as phone, address, is_default as isDefault
                    from useraddresses
                    where uid = ${uid};`
    return exec(sql);
}


const addAddress = (uid, address_id, name, phone, address, isDefault) => {
    const name1 = escape(xss(name));
    const phone1 = escape(xss(phone));
    const address1 = escape(xss(address));

    const sql = `select COUNT(*) as count
                    from useraddresses
                    where uid = ${uid};`
    let sql2 = '';
    let sql3 = '';
    return exec(sql).then(rows => {
        if (rows[0].count == 0) {     // The user does not have any address before
            sql2 = `insert into useraddresses(uid, address_id, contact_name, contact_phone, address, is_default)
                    VALUES (${uid}, ${address_id}, ${name1}, ${phone1}, ${address1}, TRUE);`
            return exec(sql2);
        } else if (isDefault) {               // There already exists a default address
            sql2 = `UPDATE useraddresses
                    SET is_default = FALSE
                    WHERE (uid, address_id) IN (
                        SELECT * FROM (
                            SELECT uid, address_id
                            FROM useraddresses
                            WHERE uid = ${uid} AND is_default = TRUE
                        ) AS subquery
                    );`
            sql3 = `insert into useraddresses(uid, address_id, contact_name, contact_phone, address, is_default)
                    VALUES (${uid}, ${address_id}, ${name1}, ${phone1}, ${address1}, TRUE);`
            return exec(sql2).then(() => {
                return exec(sql3);
            })
        } else {            // There exists a default address, but the address we are inserting is not used as default
            sql2 = `insert into useraddresses(uid, address_id, contact_name, contact_phone, address, is_default)
                    VALUES (${uid}, ${address_id}, ${name1}, ${phone1}, ${address1}, FALSE);`
            return exec(sql2);
        }
    })
}


const existDefaultAddressCheck = (uid, address_id) => {
    const sql = `select *
                    from useraddresses
                    where uid = ${uid} and address_id != ${address_id} and is_default = TRUE;`
    return exec(sql).then(rows => {
        return rows.length > 0 ? true : false;
    })
}



const editAddress = (uid, address_id, name, phone, address, isDefault) => {
    const name1 = escape(xss(name));
    const phone1 = escape(xss(phone));
    const address1 = escape(xss(address));

    let sql = '';
    let sql2 = '';
    if (isDefault) {
        sql = `UPDATE useraddresses
                SET is_default = FALSE
                WHERE (uid, address_id) IN (
                    SELECT * FROM (
                        SELECT uid, address_id
                        FROM useraddresses
                        WHERE uid = ${uid} AND is_default = TRUE
                    ) AS subquery
                );`
        sql2 = `insert into useraddresses
                VALUES (${uid}, ${address_id}, ${name1}, ${phone1}, ${address1}, TRUE)
                ON DUPLICATE KEY UPDATE contact_name = VALUES(contact_name), contact_phone = VALUES(contact_phone), address = VALUES(address), is_default = VALUES(is_default);`

        return exec(sql).then(() => {
            return exec(sql2);
        })
    } else {
        sql = `insert into useraddresses
                VALUES (${uid}, ${address_id}, ${name1}, ${phone1}, ${address1}, FALSE)
                ON DUPLICATE KEY UPDATE contact_name = VALUES(contact_name), contact_phone = VALUES(contact_phone), address = VALUES(address);`
        return exec(sql);
    }
}




const deleteAddress = (uid, addressId, isDefault) => {
    const sql = `delete from useraddresses
                    where uid = ${uid} and address_id = ${addressId};`
    return exec(sql).then(() => {
        if (isDefault) {
            const sql3 = `UPDATE useraddresses
                            JOIN (
                                SELECT uid, address_id
                                FROM useraddresses
                                WHERE uid = ${uid} AND is_default = FALSE
                                ORDER BY address_id ASC
                                LIMIT 1
                            ) AS first_record ON useraddresses.uid = first_record.uid AND useraddresses.address_id = first_record.address_id
                            SET is_default = TRUE;`
            return exec(sql3);
        }
        return true;
    })
}









// const deleteAddress = (uid, addressId) => {
//     const sql = `delete from useraddresses
//                     where uid = ${uid} and address_id = ${addressId};`
//     return exec(sql).then(() => {
//         const sql2 = `select count(*) as count
//                         from useraddresses
//                         where uid = ${uid} and is_default = TRUE;`
//         return exec(sql2);
//     }).then((rows) => {
//         if (rows[0].count === 0) return true;
//         const sql3 = `UPDATE useraddresses
//                             JOIN (
//                                 SELECT uid, address_id
//                                 FROM useraddresses
//                                 WHERE uid = ${uid} AND is_default = FALSE
//                                 ORDER BY address_id ASC
//                                 LIMIT 1
//                             ) AS first_record ON useraddresses.uid = first_record.uid AND useraddresses.address_id = first_record.address_id
//                             SET is_default = TRUE;`
//         return exec(sql3);
//     })
// }







module.exports = { getAddress, getAddressList, addAddress, existDefaultAddressCheck, editAddress, deleteAddress }