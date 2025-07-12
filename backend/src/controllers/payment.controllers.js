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

    console.log(metodoDePago)
    
    try {


        const nuevoPago = await pagoSchema.create({
            userID,
            pedido: pedidoID,
            pagoEfectivo: true,
            importe
        })

        const pedidoPagadoEnEfectivo = await pedidosSchema.findByIdAndUpdate(pedidoID,{$set:{isPayed:true, payment:nuevoPago._id}},{new:true})

        if(pedidoPagadoEnEfectivo.isPayed){
    
            const preOrderPaga = await preOrderSchema.findByIdAndUpdate(preOrdenID,{$set:{paymentMethod:'Efectivo'}},{new:true})

            io.to(connectedBistros[bistroID]).emit('preOrdenPagoVerificado', preOrderPaga)


        }

        //create crea el documento una vez y lanza error 11000 si esta duplicado
        
        res.status(200).json({message:"Se abonará en efectivo"})

    } catch (error) {
        const ERROR_DUPLICADO_CODE = 11000
        if(error.code === ERROR_DUPLICADO_CODE){

            const pagoExistente = await pagoSchema.findOne({pedido:pedidoID})

            const msgPagoEfectivo = "El pedido ya fue seleccionado para pago en efectivo"
            const msgPagadoConMp = "El pedido fue abonado con Mercado Pago"

            return res.status(409).json({message: pagoExistente.pagoEfectivo ? msgPagoEfectivo : msgPagadoConMp})
        }
      
    }

}


