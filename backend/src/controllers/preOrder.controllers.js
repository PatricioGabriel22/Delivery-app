import productSchema from "../models/product.schema.js"
import preOrderSchema from "../models/preOrder.schema.js"


import  {ListaProductos} from './productos.test.js'
import { io } from "../webSocket.js" 
import { connectedAdmins, connectedUsers } from "../webSocket.js"



//lo hago aca a mano pero en la preorder deberia viajar al local que se le hizo
const restauranteAdmin = '6806b243b7dbd643024a518d' //serian los admins


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


export const sendPreOrder =  async (req,res)=>{

    const {preOrderPayload,userInfo,importeTotal,costoEnvio,deliveryMethod} = req.body


    try {
        
        if(deliveryMethod === 'Envio' && !connectedAdmins[restauranteAdmin]){

            return res.status(501).json({message:"Local no disponible para delivery temporalmente. Podes realizar el pedido y retirarlo por el local."})
        }


        

        const nuevaPreOrden = new preOrderSchema({
            userID:userInfo.id,
            userInfo,
            preOrder:preOrderPayload,
            importeTotal:importeTotal,
            costoEnvio,
            formaDeEntrega: deliveryMethod
        })

        await nuevaPreOrden.save()


        
        //aca usar io para avisarle al front quue tiene una nueva preorden
        io.to(connectedAdmins[restauranteAdmin]).emit("nuevaPreOrdenRecibida",{
            nuevaPreOrden
        })

        res.status(200).json({message:"Pre-Orden creada"})
        



        
    } catch (error) {
        console.log(error)
    }

}




export const PreOrderManager = async (req,res)=>{


    const {orderInfo,preOrderAcceptedFlag,canceledFlag,finishedFlag,deliveredFlag,msgDeSugerencia} = req.body
    const {idOrden} = req.params

    const comprador = orderInfo?.userInfo?.id
    const userSocketID = connectedUsers[comprador]

    const restaurante = restauranteAdmin
    const adminSocketID = connectedAdmins[restaurante]

    const socketsToNotify = [userSocketID,adminSocketID]


    try {
        if(preOrderAcceptedFlag){
            const updatedOrder = await preOrderSchema.findByIdAndUpdate(
                orderInfo._id,
                {$set: {confirmed:preOrderAcceptedFlag}},
                {new:true}
            )
            
    
            console.log(updatedOrder)
    
            const nuevaDataEmitida = {
                id:updatedOrder._id,
                accepted:updatedOrder.confirmed,
                confirmedOrder:updatedOrder
            }

            
            socketsToNotify.forEach((socket)=>{
                io.to(socket).emit('preOrderStatus',nuevaDataEmitida)
            })

    
             
            return
        }

        if(canceledFlag){

            

            await preOrderSchema.deleteOne({_id:orderInfo._id},{new:true})

            
            const nuevaDataEmitida = {
                id:orderInfo._id,
                canceled:true,
                msgDeSugerencia:msgDeSugerencia
            }

            socketsToNotify.forEach((socket)=>{
                io.to(socket).emit('preOrderStatus',nuevaDataEmitida)
            })


            return res.json({infoToUser:`El cliente:${orderInfo.userInfo.username}, fue notificado`})
        }
        
        if(finishedFlag){
            const finishedOrder = await preOrderSchema.findByIdAndUpdate(idOrden,{$set:{finished:finishedFlag}},{new:true})
            


            io.to(adminSocketID).emit("finishedOrder",{
                finishedOrder
            })

            io.to(userSocketID).emit("ordenPreparada",{
                infoToUser:`${finishedOrder?.userInfo?.username}, su pedido se encuentra listo!`
            })
            
            return
        }
        
        if(deliveredFlag){
            const deliveredOrder = await preOrderSchema.findByIdAndUpdate(idOrden,{$set:{delivered:deliveredFlag}},{new:true})
    
            io.to(adminSocketID).emit("deliveredOrder",{
                deliveredOrder
            })
            return
        }
        


    } catch (error) {
        console.log(error)
    }


    
}


