import mongoose from 'mongoose'





const pedidosSchema = new mongoose.Schema({

    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    },
    pedidoEn:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bistros', 
    },
    preOrdenDeOrigen:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'preorders', 
    },
    productos:Array,
    costoEnvio:Number,
    importeTotal:Number,
    confirmed:{type:Boolean,default:false},
    finished:{type:Boolean,default:false},
    formaDeEntrega:String,
    payment:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'pago'
    },
    isPayed:{type:Boolean,default:false},
    createdAt: {
        type: Date,
        default: () => {
            const now = new Date();
            now.setHours(now.getHours() - 3); // Ajusta a GMT-3
            return now;
        }
    }
})


export default mongoose.model('pedidos',pedidosSchema)