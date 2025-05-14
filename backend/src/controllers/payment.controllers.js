import pagoSchema from '../models/pagosSchema.js';
import pedidosSchema from '../models/pedidosSchema.js';

import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'
import {connectedUsers, io, serverURL} from '../webSocket.js'

import dotenv from 'dotenv'

dotenv.config({
    path:`src/envs/.env.${process.env.NODE_ENV}`
})



const access_token_MP = 'APP_USR-8256172845098039-051009-6f781470e50160fac4e5436d6867e3f0-2432951426';
const client = new MercadoPagoConfig({ accessToken: access_token_MP });


export const pagarConEfectivo = async (req,res)=>{
    const {pedidoID, userID,importe} = req.body

    
    try {


        const nuevoPago = await pagoSchema.create({
            userID,
            pedido: pedidoID,
            pagoEfectivo: true,
            importe
        })

        await pedidosSchema.findByIdAndUpdate(pedidoID,{$set:{isPayed:true, payment:nuevoPago._id}})
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


export const pagarConMP = async (req, res) => {
    const { pedidoID, items, payer,flagVerify } = req.body;



    // Configuración del token de acceso
    const preference = new Preference(client);

    const urlsDeRetornoFront = {
        success: `${process.env.FRONT_URL}/pago-confirmado`,
        // failure: `https://qtf8ztjh-3000.brs.devtunnels.ms/`,
        // pending: `${process.env.FRONT_URL}/pago-pendiente`,
    }

   
    // ${process.env.FRONT_URL}/pago-confirmado

    const mp_bodyData = {
        items,
        payer,
        back_urls: urlsDeRetornoFront,
        auto_return: 'approved',
        notification_url : `${serverURL}/paymentSatusWH`,
        external_reference: pedidoID  
    };

    try {


        const targetPedidoYaPagado = await pedidosSchema.findById(pedidoID)

        

        if(targetPedidoYaPagado.isPayed){
            console.log("Se esta tratando de volver a pagar con mp")

            // io.to(connectedUsers[payer.last_name].socketId).emit('pagoDuplicado', { message: "Este pago ya fue registrado" })

            if(flagVerify) return res.status(200).json({verificado:"El pago fue registrado correctamente"})

            return res.status(409).json({message:"El producto ya fue abonado"})
        }

        // Crear la preferencia de pago con toda la configuración correcta
        const response = await preference.create({ body: mp_bodyData });

        console.log(response);

        // Enviar la URL de inicio de pago a la respuesta del cliente
        res.status(200).json({ init_point: response.init_point });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}


export const queryWH = async (req,res)=>{
    console.log("respuesta del WH de mercadopago: ", req.query)
    const paymentQueryMP = req.query

    if(paymentQueryMP.topic === 'payment'){

        const payment = await new Payment(client).get({id:paymentQueryMP.id})
        const userID = payment.additional_info.payer.last_name
        const mp_payment_method = payment.payment_method_id
        const importe = payment.additional_info.items[0].unit_price

        console.log(payment)

        try {
            
            const nuevoPago = await pagoSchema.create({
                userID,
                pedido:payment.external_reference,
                pagoEfectivo: false,
                mp_payment_id: req.query.id,
                mp_payment_method,
                importe
            })
    
            
            await pedidosSchema.findByIdAndUpdate(payment.external_reference,{$set:{isPayed:true, payment:nuevoPago._id}},{new:true})
            
            
        } catch (error) {
            console.log(error)
        }

    }   


    return res.sendStatus(200)
}