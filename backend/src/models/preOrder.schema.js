import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({
    path:`src/envs/.env.${process.env.NODE_ENV}`
})

const collectionTarget = process.env.PRE_ORDERS_COLLECTION

const refSchemaTarget = process.env.USER_COLLECTION

const preOrderSchema = new mongoose.Schema({

    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: refSchemaTarget, 
    },
    userInfo:Object,
    preOrder:Array,
    costoEnvio:Number,
    importeTotal:Number,
    confirmed:{type:Boolean,default:false},
    finished:{type:Boolean,default:false},
    delivered:{type:Boolean,default:false},
    formaDeEntrega:String,
    paymentMethod:{
        type:String,
        enum:['efectivo','mercado pago'],
        default:null
    },
    createdAt: {
        type: Date,
        default: () => {
            const now = new Date();
            now.setHours(now.getHours() - 3); // Ajusta a GMT-3
            return now;
        }
    }
})


export default mongoose.model(collectionTarget,preOrderSchema)