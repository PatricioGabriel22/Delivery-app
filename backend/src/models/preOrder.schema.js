import mongoose from 'mongoose'


const preOrderSchema = new mongoose.Schema({

    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    },
    bistroID:{ type: mongoose.Schema.Types.ObjectId},
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
        enum:['Efectivo','Mercado Pago'],
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






export default mongoose.model('preorders', preOrderSchema)