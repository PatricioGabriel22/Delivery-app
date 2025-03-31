import productSchema from "../models/product.schema.js"



export const shoppingCart = async (req, res) => {
    const {productList,userInfo} = req.body

    try {
        console.log(productList)
        console.log(userInfo)
        
    } catch (error) {
        console.log(error)
    }
}

