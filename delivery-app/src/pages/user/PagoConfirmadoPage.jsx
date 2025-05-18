import { Fragment } from "react";

import { BsFillBagCheckFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useShoppingContext } from "../../context/ShoppingContext";






export default function PagoConfirmadoPage(){

    const navigate = useNavigate()

    const {setTotal,setImporteTotal,setLoading,setBuyBTN,setCarrito} = useShoppingContext()

    const codigoOrden = JSON.parse(localStorage.getItem("pedidoID"))

    function limpiarSecuenciaDeCompras() {
        const keys = [
            'carrito',
            'buyBTN',
            'loadingPreOrder',
            'total',
            'pedidoID',
            'preOrdenID'
        ];

        keys.forEach((key) => localStorage.removeItem(key))

        // Resetear estados asociados
        setCarrito([])
        setBuyBTN(null);
        setLoading(null);
        setTotal(null);
        setImporteTotal(null);
    }


    return(
        <Fragment>
                <div className="flex flex-col justify-center items-center min-h-screen mt-auto gap-y-10">
                    <h1 className="text-3xl">Compra exitosa!</h1>
                    <BsFillBagCheckFill size={200} className="text-green-600"/>
                    
                    <p>Codigo de pedido: {codigoOrden}</p>

                    <buton className="p-3 bg-red-600 rounded-full"
                    onClick={()=>{limpiarSecuenciaDeCompras(); navigate('/')}}
                    >Regresar al inicio</buton>
                </div>
        </Fragment>
    )
}