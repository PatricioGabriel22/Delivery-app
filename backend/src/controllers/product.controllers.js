import productSchema from "../models/product.schema.js"
import { io } from "../server.js"



export const dataFormNewProduct = async(req,res)=>{
    

    
    const {nombre,descripcion,categoria,precio,disponible} = req.body

    try {
        
        const nuevoPoducto = new productSchema({
            nombre,
            descripcion,
            categoria,
            precio,
            disponible,
        })
    
        if(req.file){
            const imagen = req.file.buffer
            
            nuevoPoducto.img = {
                data: imagen,
                contentType: req.file.mimetype,
            } 
    
        }


        nuevoPoducto.save()


        res.json({message:"Producto agregado"})


    } catch (error) {
        console.log(error)
    }


}




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



export const editProductInfo = async (req,res)=>{
    const {nombre,descripcion,precio,id,img} = req.body

    try {
        const target = await productSchema.findByIdAndUpdate(id,{nombre,descripcion,precio})
    } catch (error) {
        
    }
}