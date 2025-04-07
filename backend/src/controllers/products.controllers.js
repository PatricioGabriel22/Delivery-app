import productSchema from "../models/product.schema.js"
import preOrderSchema from "../models/preOrder.schema.js"


import  {ListaProductos} from './productos.test.js'
import { io } from "../server.js"

export const shoppingCart = async (req, res) => {
    const {productList,userInfo} = req.body

    try {
        console.log(productList)
        console.log(userInfo)
        
    } catch (error) {
        console.log(error)
    }
}



export const checkPreOrderWithLocal = async (req,res)=>{

    const {preOrderPayload,userInfo,importeTotal,envio} = req.body

   

    try {
        console.log(req.body)
        


        await new preOrderSchema({
            userID:userInfo.id,
            userInfo,
            preOrder:preOrderPayload,
            importeTotal:importeTotal,
            formaDeEntrega: envio === 0? "Retiro en el local": "Envio"
        }).save()

        res.status(200).json({message:"Pre-Orden creada"})


        
    } catch (error) {
        console.log(error)
    }

}



export const getAllPreOrders = async (req,res)=>{
    const allPreOrders = await preOrderSchema.find({}).sort({createdAt:-1})
    res.json(allPreOrders)
}


export const PreOrderManager = async (req,res)=>{
   // const {checkedPreOrder,stockAgotado,productosAlternativos} = req.body

    const {checkedPreOrder} = req.body
    let msg

    let opcionesParaElCliente
    

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

    console.log(ListaProductos)


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

    
    
    
    
    if(checkedPreOrder.confirmed){
        await preOrderSchema.updateOne({_id:checkedPreOrder._id},{$set: {confirmed:checkedPreOrder.confirmed}})
        msg = "Su pedido ha sido confirmado"
    }else{
        msg = stockAgotado.length === 1 ? "Hubo un error con el stock de" : "Hubo un problema con el stock de los siguientes productos"

        // await preOrderSchema.deleteOne({_id:checkedPreOrder._id})

        opcionesParaElCliente = {
            agotado: stockAgotado,
            alternativas: productosAlternativos
        }
    }
    
    io.emit('checkedPreOrder',{
        id:checkedPreOrder._id,
        status:checkedPreOrder.confirmed
    })



    res.json({
        message: msg,
        orden: checkedPreOrder || opcionesParaElCliente

    })
    
}