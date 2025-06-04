import mongoose from "mongoose"


// Sí, el valor de ref debe coincidir exactamente con el nombre del modelo que definiste con mongoose.model(), incluyendo las mayúsculas y minúsculas.


const userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    direccion:String,
    localidad:String,
    entreCalles:String,
    telefono:Number,
    hintPassword:String,  
    pedidos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'pedidos'
    }],

    
},{
    timestamps:true
})



export default mongoose.model('users',userSchema)

