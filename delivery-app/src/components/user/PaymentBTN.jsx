import { Fragment } from "react"
import { useNavigate } from "react-router-dom"
import { useLoginContext } from "@context/LoginContext";
import axios from "axios";


import toast from 'react-hot-toast'



export default function PaymentBTN({paymentMethod,importeTotal}){

    const navigate = useNavigate()
    const {renderORLocalURL,userInfo} = useLoginContext()


    const pedidoID = localStorage.getItem("pedidoID")
    const preOrdenID = localStorage.getItem("preOrdenID")

    async function mp_payment_management(verifyMode){


        
        const mp_payload = {
            // Datos de la compra que querés cobrar
            pedidoID,
            preOrdenID,
            items: [
              {
                title: "Pedido Victorina",
                quantity: 1,
                unit_price: Number(importeTotal),
                currency_id: 'ARS'
              },
            ],
            payer:{
                name:userInfo.username,
                last_name:userInfo._id //uso la propiedad last name para "colar" el userid
            },
            flagVerify:verifyMode
        }

      
        
        try {
            const res = await axios.post(`${renderORLocalURL}/create_preference_MP`, mp_payload, {withCredentials: true});
        
            // Esta es la URL donde MercadoPago hace el pago
            const init_point = res.data.init_point;
        
            if(init_point){

                // Redirigís al usuario a MercadoPago
                window.location.href = init_point
    
                toast('Será redirigido a Mercado Pago', {
                icon: '🚀',
                style: {
                    background: '#009EE3',
                    color: '#fff',
                },
                })

                
            }
            
            if(res.data.verificado){
                
                toast.success(res.data.verificado)
                navigate('/pago-confirmado')

            }



        
        } catch (e) {
            console.error(e);
            toast.error(e.response.data?.message)
        }
        
    }


    async function efectivo_payment_management(){
        const efectivo_payload= {
            pedidoID,
            preOrdenID,
            userID:userInfo._id,
            importe:importeTotal,
            
        }

        try {
            
            const res = await axios.post(`${renderORLocalURL}/pagar_en_efectivo`,efectivo_payload,{withCredentials:true})

            toast.success(res.data?.message)
            navigate('/pago-confirmado')

        } catch (e) {
            toast.error(e.response.data?.message)
        }
       
    }


    function redirigirAlPago(routeToPay){

        switch(routeToPay){
            case 'Efectivo':
                efectivo_payment_management()
                break
            case 'Mercado Pago (incluye tarjetas)':
                mp_payment_management(false)
                break
        }
    }




    return(
        <Fragment>
            <button className="bg-red-600 rounded-full self-center w-[90%] md:w-[40%] p-5  text-xl cursor-pointer hover:bg-red-700"
                onClick={()=>redirigirAlPago(paymentMethod)}
            >Pagar</button>

            
            <div className={`flex flex-col w-full md:w-[40%] self-center p-2  mt-20 cursor-pointer`}
                onClick={()=> mp_payment_management(true)}
                >

                <span className="text-center p-2 text-lg">Notificar mi pago de Mercado Pago y continuar</span>
                <span className="w-full h-[1px] bg-sky-600"/>

            </div>

        </Fragment>
    )
}

// invisible