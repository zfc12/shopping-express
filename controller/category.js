const { exec, escape } = require('../db/mysql');

const getCategoryList = (storeId) => {
    const sql = `select cat_id as id, name
                    from categorys
                    where cat_id NOT IN (select cat_id
                                            from storenothavecats
                                            where store_id = ${storeId});`;
    return exec(sql);
}

const getPrimaryCategoryList = () => {
    const sql = `select primary_cat_id as id, name
                    from primarycategorys;`;
    return exec(sql);
}


// currentCategory.name = 'All'
// currentTag: {id: string; name: string}

const getAllProducts = (storeId, keyword, currentTag) => {
    const keyword1 = escape('%' + keyword + '%');
    let sql = '';
    if (currentTag.name === 'All') {
        sql = `select cat_id as catId, product_id as id, imgUrl, title, price, sales
                from products
                where store_id = ${storeId} and title like ${keyword1};`;
    } else {
        sql = `select cat_id as catId, product_id as id, imgUrl, title, price, sales
                from products
                where store_id = ${storeId} and cat_id IN (select cat_id
                                                            from primarycontainscats
                                                            where primary_cat_id = ${currentTag.id})
                and title like ${keyword1};`;
    }

    return exec(sql);
}

// currentCategory.name = 'What's new'
// currentTag: {id: string; name: string}

const getWhatsNewProducts = (storeId, keyword, currentTag) => {
    const keyword1 = escape('%' + keyword + '%');
    let sql = '';
    if (currentTag.name === 'All') {
        sql = `select p.cat_id as catId, p.product_id as id, p.imgUrl, p.title, p.price, p.sales
                from whatsnews as w, products as p
                where w.store_id = ${storeId} and w.store_id = p.store_id and w.cat_id = p.cat_id and w.product_id = p.product_id and title like ${keyword1};`;
    } else {
        sql = `select p.cat_id as catId, p.product_id as id, p.imgUrl, p.title, p.price, p.sales
                from whatsnews as w, products as p
                where w.store_id = ${storeId} and w.store_id = p.store_id and 
                        w.cat_id IN (select cat_id
                                        from primarycontainscats
                                        where primary_cat_id = ${currentTag.id}) and
                        w.cat_id = p.cat_id and w.product_id = p.product_id and
                        title like ${keyword1};`
    }

    return exec(sql);
}

// currentCategory.name = 'Discounts'
// currentTag: {id: string; name: string}

const getDiscountsProducts = (storeId, keyword, currentTag) => {
    const keyword1 = escape('%' + keyword + '%');
    let sql = '';
    if (currentTag.name === 'All') {
        sql = `select p.cat_id as catId, p.product_id as id, p.imgUrl, p.title, p.price, p.sales
                from discounts as d, products as p
                where d.store_id = ${storeId} and d.store_id = p.store_id and d.cat_id = p.cat_id and d.product_id = p.product_id and title like ${keyword1};`;
    } else {
        sql = `select p.cat_id as catId, p.product_id as id, p.imgUrl, p.title, p.price, p.sales
                from discounts as d, products as p
                where d.store_id = ${storeId} and d.store_id = p.store_id and 
                        d.cat_id IN (select cat_id
                                        from primarycontainscats
                                        where primary_cat_id = ${currentTag.id}) and
                        d.cat_id = p.cat_id and d.product_id = p.product_id and
                        title like ${keyword1};`
    }

    return exec(sql);
}

// currentCategory: id
// currentTag: {id: string; name: string}

const getProducts = (storeId, keyword, currentCategory, currentTag) => {
    const keyword1 = escape('%' + keyword + '%');
    let sql = '';
    if (currentTag.name === 'All') {
        sql = `select cat_id as catId, product_id as id, imgUrl, title, price, sales
                from products
                where store_id = ${storeId} and cat_id = ${currentCategory} and title like ${keyword1};`
    } else {
        sql = `select cat_id as catId, product_id as id, imgUrl, title, price, sales
                from products
                where store_id = ${storeId} and cat_id = ${currentCategory} and 
                        cat_id IN (select cat_id
                                    from primarycontainscats
                                    where primary_cat_id = ${currentTag.id})
                        and title like ${keyword1};`
    }

    return exec(sql);
}

module.exports = { getCategoryList, getPrimaryCategoryList, getAllProducts, getWhatsNewProducts, getDiscountsProducts, getProducts }