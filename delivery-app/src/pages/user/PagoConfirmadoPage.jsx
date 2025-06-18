import { Fragment } from "react";

import { useShoppingContext } from "@context/ShoppingContext";

import { BsFillBagCheckFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useBistroContext } from "../../context/BistrosContext";






export default function PagoConfirmadoPage(){

    const navigate = useNavigate()

    const {limpiarSecuenciaDeCompras} = useShoppingContext()
    const {bistroInfo,createSlug} = useBistroContext()

    const codigoOrden = localStorage.getItem("pedidoID")




    return(
        <Fragment>
                <div className="flex flex-col justify-center items-center min-h-screen mt-auto gap-y-10">
                    <h1 className="text-3xl">Compra exitosa!</h1>
                    <BsFillBagCheckFill size={200} className="text-green-600"/>
                    
                    <p>Codigo de pedido: {codigoOrden}</p>

                    <buton className="p-3 bg-red-600 rounded-full cursor-pointer"
                    onClick={()=>{limpiarSecuenciaDeCompras(); navigate(`/bistros/${createSlug(bistroInfo.username)}`)}}
                    >Regresar al inicio</buton>
                </div>
        </Fragment>
    )
}