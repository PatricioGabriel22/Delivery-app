import { Fragment } from "react";
import axios from 'axios'
import { useLoginContext } from "../../context/LoginContext";
import { useShoppingContext } from "../../context/ShoppingContext";
import toast from 'react-hot-toast'





export default function CancelarCompraBTN({pedidoID,preOrdenID,bistroID}){

    const {renderORLocalURL,userInfo} = useLoginContext()
    const {limpiarSecuenciaDeCompras} = useShoppingContext()


    async function cancelarMiCompraUsuario(){


        const pyaload = {
            preOrdenID,
            pedidoID,
            username:userInfo.username,
            bistroID
        }


        try {
            const res = await axios.post(`${renderORLocalURL}/cancelarPedidoUsuario/${userInfo._id}`,pyaload,{withCredentials:true})
            console.log(res)
            toast(res.data.message,{icon:'⚠️',duration:350 * 10})
            limpiarSecuenciaDeCompras()
        } catch (error) {
            console.log(error)
        }
    }





    return(
        <Fragment>
            <span 
                className="text-white p-2 cursor-pointer absolute top-0 right-0"
                onClick={()=>cancelarMiCompraUsuario()}
            >Cancelar mi compra</span>
        </Fragment>
    )
}