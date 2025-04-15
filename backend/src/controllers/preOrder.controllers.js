import productSchema from "../models/product.schema.js"
import preOrderSchema from "../models/preOrder.schema.js"


import  {ListaProductos} from './productos.test.js'
import { io } from "../server.js"



export const sendPreOrder = async (req,res)=>{

    const {preOrderPayload,userInfo,importeTotal,envio} = req.body

   

    try {
      

        const nuevaPreOrden = await new preOrderSchema({
            userID:userInfo.id,
            userInfo,
            preOrder:preOrderPayload,
            importeTotal:importeTotal,
            formaDeEntrega: envio === 0? "Retiro en el local": "Envio"
        })

        nuevaPreOrden.save()


        //aca usar io para avisarle al front quue tiene una nueva preorden
        io.emit("nuevaPreOrdenRecibida",{
            nuevaPreOrden
        })

        res.status(200).json({message:"Pre-Orden creada"})


        
    } catch (error) {
        console.log(error)
    }

}



export const getAllPreOrders = async (req,res)=>{
    const allPreOrders = await preOrderSchema.find({})
    // .sort({createdAt:-1})
    res.json(allPreOrders)
}


export const PreOrderManager = async (req,res)=>{
   // const {checkedPreOrder,stockAgotado,productosAlternativos} = req.body

    const {orderInfo,preOrderAcceptedFlag,finishedFlag,deliveredFlag,msgDeSugerencia} = req.body
    const {idOrden} = req.params

    console.log(msgDeSugerencia)


    let msg
    let opcionesParaElCliente
    let updatedOrder

    //esto en verdad viene del body
    const stockAgotado = [
        {
            "nombre": "Flautas",
            "cantidad": 2,
            "precio": 50
        },{
            "nombre": "Figasas",
            "cantidad": 2,
            "precio": 50
        },{
            "nombre": "Minion",
            "cantidad": 1,
            "precio": 100
        }
    ]

    //aca la idea es buscar en la db y "apagarlos"
    for (const agotado of stockAgotado){
        const targetFueraDeStock = ListaProductos.find(item=>item.nombre === agotado.nombre)
        if (targetFueraDeStock) targetFueraDeStock.disponible = false
        // console.log(targetFueraDeStock)
    }


    //lista de productos alternativos
    const productosAlternativos = [
        {
            "nombre": "Flautas",
            "cantidad": 1,
            "precio": 50
        },
        {
            "nombre": "Figasas",
            "cantidad": 1,
            "precio": 50
        }
    ]

    
   
    
    try {
        if(preOrderAcceptedFlag){
            updatedOrder = await preOrderSchema.findByIdAndUpdate(
                orderInfo._id,
                {$set: {confirmed:preOrderAcceptedFlag}},
                {new:true}
            )
            msg = "Su pedido ha sido confirmado"
    
            console.log(updatedOrder)
    
    
            io.emit('checkedPreOrder',{
                id:updatedOrder._id,
                status:updatedOrder.confirmed,
                confirmedOrder:updatedOrder
            })
    
    
        }else{
            msg = stockAgotado.length === 1 ? "Hubo un error con el stock de" : "Hubo un problema con el stock de los siguientes productos"
            
            // console.log(msgDeSugerencia)
            await preOrderSchema.deleteOne({_id:orderInfo._id},{new:true})
    
            if(!msg){} //cancelo definitivamente y elimino 
            

        }
        
        if(finishedFlag){
            const finishedOrder = await preOrderSchema.findByIdAndUpdate(idOrden,{$set:{finished:finishedFlag}},{new:true})
    
            io.emit("finishedOrder",{
                finishedOrder
            })
        }
        
        if(deliveredFlag){
            const deliveredOrder = await preOrderSchema.findByIdAndUpdate(idOrden,{$set:{delivered:deliveredFlag}},{new:true})
    
            io.emit("deliveredOrder",{
                deliveredOrder
            })
        }
        


    } catch (error) {
        console.log(error)
    }


    
}


export const dataFormWithImage = async(req,res)=>{
    

    
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