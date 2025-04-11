import mongoose from "mongoose"



// const collectionTarget = TEST ? "users-test"

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
    hintPassword:String
    
},{
    timestamps:true
})



export default mongoose.model('users-test',userSchema)

