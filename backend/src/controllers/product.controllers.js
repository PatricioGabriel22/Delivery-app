import { Socket } from "socket.io"
import { cloudinary } from "../cloudinary.js"
import productSchema from "../models/product.schema.js"
import { io } from "../webSocket.js" 

import { connectedBistros } from "../webSocket.js"
import { modifyData } from "./auxFunctions.js"

// const restauranteBistro = '6806b8fe2b72a9697aa59e5f' //serian los bistros


export async function catalogMaker(req,res){
    const {idBistro} = req.params


    try {
        const catalogoDelBistro = await productSchema.find({bistroOwner:idBistro})

        

        res.json({catalogoDelBistro})
    } catch (error) {
        console.log(error)
    }
}




export const dataFormNewProduct = async(req,res)=>{
    

    const {idBistro} = req.params
    const {nombre,descripcion,categoria,precio,disponible} = req.body
        

    

    try {
        
        const nuevoProducto = new productSchema({
            bistroOwner:idBistro,
            nombre,
            descripcion,
            categoria,
            precio,
            disponible,
        })
    
        if(req.file){
            const imagen = req.file.path
            
            nuevoProducto.img = imagen 
    
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
            
            //to(connectedBistros[restauranteBistro])
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
    const {nombre,descripcion,precio,id,temporalIMG} = req.body
    
    

    console.log(temporalIMG)

    const logoApp = {
        path: 'https://res.cloudinary.com/db8wo1wrm/image/upload/v1746541592/productos/sxc84fxav3vdaoz1jouf.png',
        filename: 'productos/sxc84fxav3vdaoz1jouf'
    }

    try {



        const updatedFields = {
            nombre,
            descripcion,
            precio,
            img: temporalIMG ? logoApp.path : "",
            public_IMG_ID: temporalIMG ? logoApp.filename : "",
        }

        modifyData(id,productSchema,updatedFields,req.file,io,"cardProductoActualizada")



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