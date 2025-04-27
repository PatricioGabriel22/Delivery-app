import productSchema from "../models/product.schema.js"
import preOrderSchema from "../models/preOrder.schema.js"


import  {ListaProductos} from './productos.test.js'
import { io } from "../webSocket.js" 
import { connectedAdmins, connectedUsers } from "../webSocket.js"
import pedidosSchema from "../models/pedidosSchema.js"
import userSchema from "../models/user.schema.js"



//lo hago aca a mano pero en la preorder deberia viajar al local que se le hizo, cambiar tambien para websocket para ver los conectados
const restauranteAdmin = '6806b8fe2b72a9697aa59e5f' //serian los admins



export const getAllPedidos = async (req,res)=>{

    const {rol,page,limit} = req.query 
    const {idTarget} = req.params
    
  
    let allOrders
    let totalPages
  

    // if(!idTarget || !rol) return res.status(400).json({ error: 'Faltan datos: idTarget o rol' })

    try {
        const hasPagination = rol === 'cliente' ? true : false
        const skippedData = (page-1)*limit
        const parseLimit = parseInt(limit)


        switch (rol) {
            case 'admin':
                

                const query = pedidosSchema.find({})
                
                if(hasPagination){

                    query.skip(skippedData).limit(parseLimit)
                }
                
                allOrders = await query.exec()

                
                const totalOrders = await pedidosSchema.countDocuments()
                totalPages = hasPagination ? Math.ceil(totalOrders / parseLimit) : 1
                    


            break
        
            case 'cliente':

                let userConPedidos = await userSchema.findById(idTarget)
                    .populate({path:'pedidos',
                        options: {
                            sort:{ createdAt: -1 },
                            skip:skippedData,
                            limit:parseLimit
                        }})

                allOrders = userConPedidos.pedidos
                
                const totalOrdersFromUser = userConPedidos.pedidos.length
                    console.log(totalOrdersFromUser)
                
                totalPages = Math.ceil(totalOrdersFromUser / parseLimit)

       
                
                
            break
            
        } 

        res.json({
            allOrders:allOrders,
            totalPages:totalPages
        })

    } catch (error) {
        console.log(error)
    }


}

export const pivoteDePreOrdenes = async (req,res)=>{

    
    const {idAdmin} = req.params
   
    

    if(!idAdmin) return res.status(400)

    //dejemos cuestiones de preORdenes SOLO para los admins

    try {
        
        const allPreOrders = await preOrderSchema.find({})


        res.json(allPreOrders)

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


    const {orderInfo,status,notification} = req.body
    const {idOrden} = req.params
    console.log(req.body)

    const comprador = orderInfo?.userInfo?.id
    const userSocketID = connectedUsers[comprador].socketId

    const restaurante = restauranteAdmin
    const adminSocketID = connectedAdmins[restaurante]

    const socketsToNotify = [userSocketID,adminSocketID]


    let nuevaDataEmitida



    try {

        switch (status) {
            case 'aceptada':
                
                const updatedOrder = await preOrderSchema.findByIdAndUpdate(
                    orderInfo._id,
                    {$set: {confirmed:true}},
                    {new:true}
                )
                
                const nuevoPedido =  new pedidosSchema({
                    
                    userID:orderInfo.userInfo.id,
                    productos:orderInfo.preOrder,
                    costoEnvio:orderInfo.costoEnvio,
                    importeTotal:orderInfo.importeTotal,
                    confirmed:true,
                    formaDeEntrega:updatedOrder.formaDeEntrega,

                })

                await nuevoPedido.save()

                await userSchema.findByIdAndUpdate(
                    orderInfo.userInfo.id,
                    { $push: { pedidos: nuevoPedido._id } }
                )
        
                console.log(updatedOrder)
        
                nuevaDataEmitida = {
                    id:updatedOrder._id,
                    accepted:updatedOrder.confirmed,
                    confirmedOrder:updatedOrder,
                    nuevoPedido
                }

                
                socketsToNotify.forEach((socket)=>{
                    io.to(socket).emit('preOrderStatus',nuevaDataEmitida)
                })



            break;
                
            case 'cancelada':
                await preOrderSchema.deleteOne({_id:orderInfo._id},{new:true})

            
                nuevaDataEmitida = {
                    id:orderInfo._id,
                    canceled:true,
                    msgDeSugerencia:notification
                }
    
                socketsToNotify.forEach((socket)=>{
                    io.to(socket).emit('preOrderStatus',nuevaDataEmitida)
                })
    
    
                res.json({infoToUser:`El cliente:${orderInfo.userInfo.username}, fue notificado`})

            break

            case 'preparada':

                const finishedOrder = await preOrderSchema.findByIdAndUpdate(idOrden,{$set:{finished:true}},{new:true})
            
                console.log(userSocketID,adminSocketID)
    
                io.to(adminSocketID).emit("finishedOrder",{
                    finishedOrder
                })
    
                io.to(userSocketID).emit("ordenPreparada",{
                    infoToUser:`${orderInfo.userInfo.username} su pedido se encuentra listo!`
                })
                
            break   
            
            case 'entregada':
                const deliveredOrder = await preOrderSchema.findByIdAndUpdate(idOrden,{$set:{delivered:true}},{new:true})
    
                io.to(adminSocketID).emit("deliveredOrder",{
                    deliveredOrder
                })
            break

        }

    


    } catch (error) {
        console.log(error)
    }


    
}


