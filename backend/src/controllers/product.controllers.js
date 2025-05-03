import productSchema from "../models/product.schema.js"
import { io } from "../webSocket.js" 

import { connectedAdmins } from "../webSocket.js"

const restauranteAdmin = '6806b8fe2b72a9697aa59e5f' //serian los admins


export async function catalogMaker(req,res){
    const {idAdmin} = req.params


    try {
        const catalogoDelAdmin = await productSchema.find({adminOwner:idAdmin})

        

        res.json({catalogoDelAdmin})
    } catch (error) {
        console.log(error)
    }
}




export const dataFormNewProduct = async(req,res)=>{
    

    const {idAdmin} = req.params
    const {nombre,descripcion,categoria,precio,disponible} = req.body
    console.log(idAdmin)

    try {
        
        const nuevoProducto = new productSchema({
            adminOwner:idAdmin,
            nombre,
            descripcion,
            categoria,
            precio,
            disponible,
        })
    
        if(req.file){
            const imagen = req.file.buffer
            
            nuevoProducto.img = {
                data: imagen,
                contentType: req.file.mimetype,
            } 
    
        }


        nuevoProducto.save()

        io.emit('productoAgregado',{nuevoProducto: nuevoProducto})


        res.json({message:"Producto agregado"})


    } catch (error) {
        console.log(error)
        res.json({errorMessage:"Hubo un problema al crear el nuevo producto"})

    }


}




export const changeStatus = async (req,res)=>{

    const {id,disponible} = req.body

    

    try {
        
        const target = await productSchema.findByIdAndUpdate(id,{$set:{disponible:!disponible}},{new:true})
        if(target){
            console.log("entramos al if del socket")
            
            //to(connectedAdmins[restauranteAdmin])
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
    console.log(req.body)
    try {
        const target = await productSchema.findByIdAndUpdate(id,{nombre,descripcion,precio})
    } catch (error) {
        
    }
}



export async function eliminarProductoDB(req,res) {
    const {id} = req.params

    try {
        const target = await productSchema.findByIdAndDelete(id)

        if(!target) res.status(400).json({error:"Error al eliminar el producto"})
        
        io.emit('productoEliminado',{deletedId:target._id})

        res.status(200).json({message:`${target.nombre} fue eliminado`})

    } catch (error) {
        console.log(error)
    }
}