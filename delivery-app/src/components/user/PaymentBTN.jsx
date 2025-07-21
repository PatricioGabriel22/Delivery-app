import { Fragment } from "react"
import { useNavigate } from "react-router-dom"
import { useLoginContext } from "@context/LoginContext";
import axios from "axios";


import toast from 'react-hot-toast'
import { useBistroContext } from "../../context/BistrosContext";
import { Copy } from "lucide-react";

import { IoAlertCircleOutline } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";

export default function PaymentBTN({paymentMethod,importeTotal}){

    const navigate = useNavigate()
    const {renderORLocalURL,userInfo} = useLoginContext()
    const {bistroInfo} = useBistroContext()

    const pedidoID = localStorage.getItem("pedidoID")
    const preOrdenID = localStorage.getItem("preOrdenID")
    const auxTelefonoDelBistro = JSON.parse(localStorage.getItem('telefonoBistro')) || bistroInfo.telefono
    



    async function payment_management(paymentMethod){

        if(!paymentMethod) return toast.error("Debe seleccionar un metodo de pago")

        const pago_payload= {
            pedidoID,
            preOrdenID,
            bistroID: bistroInfo._id,
            userID:userInfo._id,
            importe:importeTotal,
            metodoDePago: paymentMethod === 'Efectivo' ? 'Efectivo' : paymentMethod
            
        }



        try {
            
            console.log("Aguardando res del servidor ")
            const res = await axios.post(`${renderORLocalURL}/pagar`,pago_payload,{withCredentials:true})
            console.log(res)
            if(res) navigate('/pago-confirmado')

        } catch (e) {
            console.log(e)
        }
       
    }





    async function copiarTelefono(telefono){
        try {
            
            await navigator.clipboard.writeText(telefono)
            toast.success(`Copiaste el telefono: ${telefono}. Recordá enviar el comprobante de tu pago online.`)
        } catch (error) {
            console.log(error)
        }

    }


    return(
        <Fragment>
            <button className="bg-red-600 rounded-full self-center w-[90%] md:w-[40%] p-5  text-xl cursor-pointer hover:bg-red-700"
                onClick={()=>payment_management(paymentMethod)}
            >Notificar mi forma de pago</button>

            <p className="text-center p-2 flex flex-col md:flex-row items-center cursor-pointer justify-center bg-yellow-900 mt-2"> <IoAlertCircleOutline size={46} className="text-yellow-400"/> Aunque hayas notificado recordá enviar el comprobante al local para terminar de confirmar.</p>
            <p className="text-center p-2 text-lg font-bold flex flex-row items-center justify-center gap-x-3 cursor-pointer" onClick={()=>copiarTelefono(auxTelefonoDelBistro)}><FaWhatsapp size={40} className="text-green-800"/> {auxTelefonoDelBistro } <Copy size={16}/> </p>
        </Fragment>
    )
}

// invisible