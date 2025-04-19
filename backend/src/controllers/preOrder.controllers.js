import productSchema from "../models/product.schema.js"
import preOrderSchema from "../models/preOrder.schema.js"


import  {ListaProductos} from './productos.test.js'
import { io } from "../server.js"



export const sendPreOrder =  (req,res)=>{

    const {preOrderPayload,userInfo,importeTotal,costoEnvio,deliveryMethod} = req.body

   


    try {
      

        const nuevaPreOrden =  new preOrderSchema({
            userID:userInfo.id,
            userInfo,
            preOrder:preOrderPayload,
            importeTotal:importeTotal,
            costoEnvio,
            formaDeEntrega: deliveryMethod
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

    const {rol} = req.body 
    const {idTarget} = req.params
   
    let allOrders

    if(!idTarget || !rol) return res.status(400)

    try {
        
        switch (rol) {
            case 'admin':
                
                allOrders = await preOrderSchema.find({})
                //ca tendria que buscar las ordenes que tengan como dueño al local tal para gestionarlas
                break
        
            default:
                allOrders = await preOrderSchema.find({userID:idTarget})
                //ca tendria que buscar las ordenes que tengan como dueño al USUARIO tal para gestionarlas independiemtemente de donde compren
                break
        }

        res.json(allOrders)

    } catch (error) {
        console.log(error)
    }

    

}


export const PreOrderManager = async (req,res)=>{


    const {orderInfo,preOrderAcceptedFlag,canceledFlag,finishedFlag,deliveredFlag,msgDeSugerencia} = req.body
    const {idOrden} = req.params


    try {
        if(preOrderAcceptedFlag){
            const updatedOrder = await preOrderSchema.findByIdAndUpdate(
                orderInfo._id,
                {$set: {confirmed:preOrderAcceptedFlag}},
                {new:true}
            )
            
    
            console.log(updatedOrder)
    
    
            io.emit('checkedPreOrder',{
                id:updatedOrder._id,
                status:updatedOrder.confirmed,
                confirmedOrder:updatedOrder
            })
    
    
        }

        if(canceledFlag){

            

            await preOrderSchema.deleteOne({_id:orderInfo._id},{new:true})

            
            io.emit('sugerenciaDelLocal',{
                canceledFlag,
                msgDeSugerencia
            })

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


