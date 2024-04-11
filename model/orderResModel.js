// userAddress: {id: string, name: string, phone: string, address: string}
// delivery_time: string
// total: float
// shopList: Array<{shopId: string, shopName: string, cartList: Array<{productId: string, imgUrl: string, weight: string, title: string, price: float, count: int}>}>


function createOrderResModel(userAddress, delivery_time, total, shopList) {
    return {
        address: userAddress,
        time: delivery_time,
        total,
        shop: shopList
    }
}

module.exports =  createOrderResModel; 