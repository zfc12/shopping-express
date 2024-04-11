// store_location: location: {id: String, store_name: String}
// banner_lst: banners: Array<{id: String, imgUrl: String}>
// cat_id: categories: Array<{id: String, name: String, imgUrl: String}>
// whatsnew_lst: freshes: Array<{id: String, name: String, imgUrl: String, price: String}>
// discount_lst: discounts: Array<{id: String, name: String, imgUrl: String, price: String}>


function createHomeResModel(store_location, banner_lst, cat_lst, whatsnew_lst, discount_lst) {
    return {
        location: store_location,
        banners: banner_lst,
        categories: cat_lst,
        freshes: whatsnew_lst,
        discounts: discount_lst
    }
}

module.exports = { createHomeResModel }