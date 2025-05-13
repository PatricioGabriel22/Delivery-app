import mongoose from "mongoose";


const pagoSchema = new mongoose.Schema({
    userID:{type: mongoose.Schema.Types.ObjectId,ref:'users'},
    pedido:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'pedidos',
        unique:true
    },
    pagoEfectivo:{type:Boolean, default: true},
    mp_payment_id:String,
    mp_payment_method:String,
    importe: Number,
    createdAt:{
        type:Date,
        default: ()=>{
            const now = new Date()
            now.setHours(now.getHours() - 3)
            return now
        }
    }
})


export default mongoose.model('pago',pagoSchema)