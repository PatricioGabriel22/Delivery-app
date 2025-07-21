import pagoSchema from '../models/pagosSchema.js';
import pedidosSchema from '../models/pedidosSchema.js';


import {connectedUsers, io, connectedBistros} from '../webSocket.js'


import axios from 'axios'

import preOrderSchema from '../models/preOrder.schema.js';
import bistroSchema from '../models/bistro.schema.js';
import userSchema from '../models/user.schema.js';

import dotenv from 'dotenv'
dotenv.config({
    path:`src/envs/.env.${process.env.NODE_ENV}`
})







export const calcularPagosEnRango = async (req,res)=>{
    const {desde,hasta,bistroID} = req.query



    const periodoDeVentas = await pedidosSchema.aggregate([
        {
            $match: {
            // bistroID: bistroID,
            createdAt: {
                $gte: new Date(desde),
                $lt: new Date(hasta)
            }
            }
        },
        {
            $group: {
            _id: null,
            totalVentas: { $sum: "$importeTotal" }
            }
        }
    ])

    const importeDelRango = periodoDeVentas[0]?.totalVentas || 0
    
    // io.to(connectedBistros['6806b8fe2b72a9697aa59e5f']).emit("ventasEnPeriodoSeleccionado",periodoDeVentas)
    res.status(200).json({importeDelRango })
}


export const pagoManagement = async (req,res)=>{
    const {pedidoID,preOrdenID, userID,importe,bistroID,metodoDePago} = req.body

    console.log("metodo de pago: ",metodoDePago)
    
    console.log(req.body)
    console.log(connectedBistros[bistroID])

    try {


        const nuevoPago = await pagoSchema.create({
            userID,
            pedido: pedidoID,
            pagoEfectivo: metodoDePago === 'Efectivo' ? true : false,
            importe
        })


        await pedidosSchema.findByIdAndUpdate(pedidoID,{$set:{isPayed:true, payment:nuevoPago._id}},{new:true})

        const preOrderPaga = await preOrderSchema.findByIdAndUpdate(preOrdenID,{$set:{paymentMethod: metodoDePago}},{new:true})
        
        io.to(connectedBistros[bistroID]).emit('preOrdenPagoVerificado', preOrderPaga)
        io.to(connectedUsers[userID].socketId).emit('notificarPago',{pagado:true,message:`Se abonará en ${metodoDePago}`})

 
        
        res.status(200).json({ message: 'Pago registrado correctamente' })

    } catch (error) {

        if(error){
            io.to(connectedUsers[userID].socketId).emit('notificarPago',{duplicado:true,messagePagoDuplicado:`El pago ya fue registrado.`})

        }
      
    }

}


