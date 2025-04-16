import mongoose from 'mongoose'


const preOrderSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
    },
    userInfo:Object,
    preOrder:Array,
    costoEnvio:Number,
    importeTotal:Number,
    confirmed:{type:Boolean,default:false},
    finished:{type:Boolean,default:false},
    delivered:{type:Boolean,default:false},
    formaDeEntrega:String,
    createdAt: {
        type: Date,
        default: () => {
            const now = new Date();
            now.setHours(now.getHours() - 3); // Ajusta a GMT-3
            return now;
        }
    }
})


export default mongoose.model('PreOrder',preOrderSchema)