import mongoose from "mongoose" 


const productSchema = new mongoose.Schema({
    adminOwner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'users-test'
    },
    nombre: String,
    descripcion: String,
    categoria: String,
    precio: Number,
    disponible:{type:Boolean,default:true},
    img: {
      data: {
        type: Buffer,
        required: false,
        default: undefined
      },
      contentType: {
        type: String,
        required: false,
        default: undefined
      }
    }
})

const collectionTarget = "products-test"
// const collectionTarget = TEST ? "products-test" : "products" 

export default mongoose.model(collectionTarget, productSchema)