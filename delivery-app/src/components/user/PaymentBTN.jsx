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
            pedidoID:JSON.parse(sessionStorage.getItem("pedidoID")),
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
                last_name:userInfo.id
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


    async function efectivo_payment_management(){
        const efectivo_payload= {
            pedidoID:JSON.parse(sessionStorage.getItem("pedidoID")),
            userID:userInfo.id,
            importe:importeTotal
        }

        await axios.post(`${renderORLocalURL}/pagar_en_efectivo`,efectivo_payload,{withCredentials:true})
        .then(res=>console.log(res))
        .catch(e=>console.log(e))
    }


    function redirigirAlPago(routeToPay){

        switch(routeToPay){
            case 'Efectivo':
                efectivo_payment_management()
                navigate('/pago-confirmado')
                break
            case 'Mercado Pago (incluye tarjetas)':
                mp_payment_management()
                break
        }
    }

    return(
        <Fragment>
            <button className="bg-red-600 rounded-full self-center w-full md:w-[40%] p-5  text-xl cursor-pointer hover:bg-red-700"
                onClick={()=>redirigirAlPago(paymentMethod)}
            >Pagar</button>

        </Fragment>
    )
}