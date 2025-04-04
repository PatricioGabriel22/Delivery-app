import mongoose from 'mongoose'


const preOrderSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
    },
    userInfo:Object,
    preOrder:Array,
    importeTotal:Number,
    confirmed:{type:Boolean,default:false},
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