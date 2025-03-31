import mongoose from "mongoose" 


const productSchema = new mongoose.Schema({
    productName: String,
    description: String,
    category: String,
    price: Number
})

const collectionTarget = "products-test"
// const collectionTarget = TEST ? "products-test" : "products" 

export default mongoose.model(collectionTarget, productSchema)