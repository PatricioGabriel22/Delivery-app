import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config({
    path:`src/envs/.env.${process.env.NODE_ENV}`
})

const collectionTarget = process.env.USER_COLLECTION




// Sí, el valor de ref debe coincidir exactamente con el nombre del modelo que definiste con mongoose.model(), incluyendo las mayúsculas y minúsculas.


const userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    direccion:String,
    localidad:String,
    entreCalles:String,
    telefono:Number,
    rol:{
        type:String,
        enum:["admin","cliente","GM"],
        default:'cliente'
    },
    hintPassword:String,
    categorias:{type: [String],default:[]}, //SOLO ADMINS    
    pedidos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Pedidos'
    }]
    
},{
    timestamps:true
})



export default mongoose.model(collectionTarget,userSchema)

