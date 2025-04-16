import mongoose from "mongoose"



// const collectionTarget = TEST ? "users-test"


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
    categorias:{type: [String],default:[]}
    
},{
    timestamps:true
})



export default mongoose.model('users-test',userSchema)

