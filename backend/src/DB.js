import mongoose from "mongoose"




export async function connectDB(uri){
    mongoose.connect(uri).then(()=>console.log("Conectado a la DB"))
}