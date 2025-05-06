import mongoose from "mongoose" 
import dotenv from 'dotenv'

dotenv.config({
    path:`src/envs/.env.${process.env.NODE_ENV}`
})

const collectionTarget = process.env.PRODUCTOS_COLLECTION

const refSchemaTarget = process.env.USER_COLLECTION






const productSchema = new mongoose.Schema({
    adminOwner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:refSchemaTarget,
    },
    nombre: String,
    descripcion: String,
    categoria: String,
    precio: Number,
    disponible:{type:Boolean,default:true},
    img: String,
    public_IMG_ID:String

    //para almacenar la imagen como binario
    // {
    //   data: {
    //     type: Buffer,
    //     required: false,
    //     default: undefined
    //   },
    //   contentType: {
    //     type: String,
    //     required: false,
    //     default: undefined
    //   }
    // }
})



export default mongoose.model(collectionTarget, productSchema)