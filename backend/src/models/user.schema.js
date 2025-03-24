import mongoose from "mongoose"



// const collectionTarget = TEST ? "users-test"

const userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    
},{
    timestamps:true
})



export default mongoose.model('users-test',userSchema)

