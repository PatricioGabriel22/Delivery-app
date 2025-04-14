import mongoose from "mongoose" 


const productSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    categoria: String,
    precio: Number,
    disponible:{type:Boolean,default:true},
    img:{data:Buffer,contentType: String}
})

const collectionTarget = "products-test"
// const collectionTarget = TEST ? "products-test" : "products" 

export default mongoose.model(collectionTarget, productSchema)