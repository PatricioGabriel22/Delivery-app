import { modifyData } from "../middlewares/imageCloudinaryFunc.js"
import bistroSchema from "../models/bistro.schema.js"
import { connectedUsers,connectedBistros, io } from "../webSocket.js" 


export const agregarCategoriaDeProductoAlLocal = async(req,res)=>{
    const {id,categoria} = req.body

    try {

        const nuevaCategoriaAgregada = await bistroSchema.findByIdAndUpdate(id,{$addToSet : {categorias: categoria}},{new:true})

       

        if(nuevaCategoriaAgregada){

            io.emit('categoriaAgregada',{
                status:true,
                listaCategorias:nuevaCategoriaAgregada.categorias
            })

            res.json({"message":`La categoria: ${categoria.toUpperCase()} fue agregada`})
        }




    } catch (error) {
        console.log(error)
    }



}



export const getDeliveryStatus = async (req,res) =>{
    const {idRestaurant} = req.params
    console.log(idRestaurant)
    const targetRestaurant = await bistroSchema.findById(idRestaurant)

    res.status(200).json({deliveryStatus:targetRestaurant.doDelivery})
}

export const estadoDelDelivery = async (req,res)=>{
    const {idRestaurant,flagDelivery} = req.body

    try {
        const target = await bistroSchema.findByIdAndUpdate(idRestaurant,{$set:{doDelivery:!flagDelivery}},{new:true})
        
        io.emit('cambioDeEstadoDelivery',target.doDelivery)

        res.status(200).json({deliveryStatus:target.doDelivery})
    } catch (error) {
        console.log(error)
    }

}


export const getTiendaStatus = async (req,res) =>{
    const {idRestaurant} = req.params
    console.log(idRestaurant)
    const targetRestaurant = await bistroSchema.findById(idRestaurant)

    res.status(200).json({tiendaStatus:targetRestaurant.isOpen})
}




export const changeTiendaStatus = async (req,res) =>{
    const {idRestaurant} = req.params
    const {isOpen} = req.body
    
    console.log(idRestaurant)
    const targetRestaurant = await bistroSchema.findByIdAndUpdate(idRestaurant,{$set:{isOpen:!isOpen}},{new:true})

    res.status(200).json({tiendaStatus:targetRestaurant.isOpen})
}



export const guardarNuevaConfiguracion = async (req,res)=>{
    const {idBistro} = req.params
    const {nuevas_zonas_precios,nuevas_categorias} = req.body

    try {
        
        console.log(req.file)
       

        const updateParams = {
            zonas_delivery: JSON.parse(nuevas_zonas_precios),
            categorias: JSON.parse(nuevas_categorias)
        }
    
        modifyData(idBistro,bistroSchema,updateParams,req.file,'nuevaConfiguracion')
        res.status(200).json({message:"Cambios guardados!"})
    } catch (error) {
        console.log(error)
    }


    // let updateData = {}

    // if (nuevas_zonas_precios !== null) {
    //     updateData.zonas_delivery = nuevas_zonas_precios
    // }

    // if (nueva_foto !== null) {
    //     updateData.img = nueva_foto
    // }

    // if (nuevas_categorias !== null) {
    //     updateData.categorias = nuevas_categorias
    // }


    // if(Object.keys(updateData).length > 0){
    //     console.log("objeto creado updatedData",updateData)
    //     const target = await bistroSchema.findByIdAndUpdate(idBistro,{$set: updateData},{new:true})

    //     io.emit('nuevaConfiguracion',target)
    // }



}

