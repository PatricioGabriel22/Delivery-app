import bistroSchema from "../models/bistro.schema.js"
import { connectedBistros, io } from "../webSocket.js" 


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



export const findRestaurant = async (req,res) =>{
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

export const guardarNuevaConfiguracion = async (req,res)=>{
    const {idBistro} = req.params
    const {nuevas_zonas_precios,nueva_foto,nuevas_categorias} = req.body

    console.log("bodyde la req",req.body)

    let updateData = {}

    if (nuevas_zonas_precios !== null) {
        updateData.zonas_delivery = nuevas_zonas_precios
    }

    if (nueva_foto !== null) {
        updateData.imgBistro = nueva_foto
    }

    if (nuevas_categorias !== null) {
        updateData.categorias = nuevas_categorias
    }


    if(Object.keys(updateData).length > 0){
        console.log("objeto creado updatedData",updateData)
        const target = await bistroSchema.findByIdAndUpdate(idBistro,{$set: updateData},{new:true})

        io.emit('nuevaConfiguracion',target)
        res.status(200).json({message:"Cambios guardados!"})
    }



}

