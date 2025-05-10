import { Fragment } from "react"
import { useNavigate } from "react-router-dom"
import { useLoginContext } from "../../context/LoginContext";
import axios from "axios";







export default function PaymentBTN({paymentMethod,importeTotal}){

    const navigate = useNavigate()
    const {renderORLocalURL,userInfo} = useLoginContext()

    async function mp_payment_management(){

        console.log("entro a mp payment ")

        
        const mp_payload = {
            // Datos de la compra que querés cobrar
            items: [
              {
                title: "Pedido Victorina",
                quantity: 1,
                unit_price: Number(importeTotal),
                currency_id: 'ARS'
              },
            ],
            payer:{
                name:userInfo.username
            }
        }

       

        try {
            const res = await axios.post(`${renderORLocalURL}/create_preference_MP`, mp_payload, {withCredentials: true});
        
            // Esta es la URL donde MercadoPago hace el pago
            const init_point = res.data.init_point;
        
            // Redirigís al usuario a MercadoPago
            window.location.href = init_point

            
        
          } catch (error) {
            console.error(error);
        }
        
    }


    function redirigirAlPago(routeToPay,callbackMP){

        switch(routeToPay){
            case 'Efectivo':
                navigate('/pago-confirmado')
                break
            case 'Mercado Pago (incluye tarjetas)':
                callbackMP()
                break
        }
    }

    return(
        <Fragment>
            <button className="bg-red-600 rounded-full self-center w-full md:w-[40%] p-5  text-xl cursor-pointer hover:bg-red-700"
                onClick={()=>redirigirAlPago(paymentMethod,mp_payment_management)}
            >Pagar</button>

        </Fragment>
    )
}