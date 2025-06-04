import mongoose from "mongoose" 



const productSchema = new mongoose.Schema({
    bistroOwner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'users',
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





export default mongoose.model('productos', productSchema)