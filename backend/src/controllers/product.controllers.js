import productSchema from "../models/product.schema.js"
import { io } from "../server.js"



export const changeStatus = async (req,res)=>{

    const {id,disponible} = req.body

    console.log(req.body)

    try {
        
        const target = await productSchema.findByIdAndUpdate(id,{$set:{disponible:!disponible}},{new:true})
        console.log(target)
        if(target){
            console.log(target)
            io.emit('AlterProductStatus',{
                target
            })
            res.json({info:'Estado actualizado'})
        }

    } catch (error) {
        console.log(error)
    }



}