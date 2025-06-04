import userSchema from "../models/user.schema.js"




export const agregarCategoriaDeProductoAlLocal = async(req,res)=>{
    const {id,categoria} = req.body

    try {

        const nuevaCategoriaAgregada = await userSchema.findByIdAndUpdate(id,{$addToSet : {categorias: categoria}},{new:true})

       

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

    const targetRestaurant = await userSchema.findById(idRestaurant)

    res.status(200).json({deliveryStatus:targetRestaurant.doDelivery})
}

export const estadoDelDelivery = async (req,res)=>{
    const {idRestaurant,flagDelivery} = req.body

    try {
        const target = await userSchema.findByIdAndUpdate(idRestaurant,{$set:{doDelivery:!flagDelivery}},{new:true})
        
        io.emit('cambioDeEstadoDelivery',target.doDelivery)

        res.status(200).json({deliveryStatus:target.doDelivery})
    } catch (error) {
        console.log(error)
    }

}



