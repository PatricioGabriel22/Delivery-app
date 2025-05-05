import mongoose from "mongoose"




export async function connectDB(uri){
    console.log(uri)
    mongoose.connect(uri)
        .then(()=>console.log("Conectado a la DB"))
        .catch(e=>console.log(e))
}