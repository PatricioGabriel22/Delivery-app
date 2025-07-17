/* eslint-disable react-hooks/rules-of-hooks */
import { Fragment } from "react";
import BannerCloseLogo from "@components/common/BannerCloseLogo";
import { verFecha, verHoraYMinutos } from "../../utils/dateFunctions";
import { useLoginContext } from "../../context/LoginContext";
import { Link } from "react-router-dom";
import { useShoppingContext } from "../../context/ShoppingContext";







export default function ConfirmedOrderModal({ref,close,confirmedOrder}){

    if (!confirmedOrder) return;


    const {userInfo} = useLoginContext()
    const {setImporteTotal} = useShoppingContext()
    const {productos,costoEnvio,importeTotal,formaDeEntrega,createdAt,isPayed,_id} = confirmedOrder
    const {username,telefono,direccion,entreCalles} = confirmedOrder.userID

 
    function retomarPago(){
        localStorage.setItem('pedidoID',confirmedOrder._id)
        localStorage.setItem('preOrdenID',confirmedOrder.preOrdenDeOrigen)
        localStorage.setItem('paymentMethods',JSON.stringify(confirmedOrder.pedidoEn.mediosDePago))
        localStorage.setItem('telefonoBistro', JSON.stringify(confirmedOrder.pedidoEn.telefono))

        setImporteTotal(confirmedOrder.importeTotal)
    }

    return(
        <Fragment>

            <dialog 

                ref={ref} 
                className="rounded-xl p-6 shadow-xl w-full md:w-120 justify-self-center self-center backdrop:bg-black/50 text-xl overflow-x-hidden font-semibold">

                <BannerCloseLogo close={close}/>
               
                <p className="text-center">{verFecha(createdAt)} | {verHoraYMinutos(createdAt)}</p>

                {userInfo.rol && (
                    <Fragment>

                        <p>Nombre: {username}</p>
                        <p>Telefono: {telefono}</p>
                        <p>Direccion: {direccion}</p>
                        <p>Entre calles: {entreCalles}</p>
                    </Fragment>
                )}

                {!userInfo.rol && (
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-center">Compraste en {confirmedOrder.pedidoEn.username}</p>
                        <img src={confirmedOrder.pedidoEn.img || '/logoApp.png'} width={80} className="rounded-full object-cover w-20 h-20"/>

                    </div>
                )}
                <div className="w-full h-[1px] my-3 bg-red-600"/>
                    


            
                <div className="h-[10%]">

                    {productos.map((producto)=>( 
                        
                        <div className="flex flex-row w-full justify-between p-1 my-3 border-1 border-black" key={producto._id}>
                            <p >{producto.cantidad}x {producto.nombre}</p>
                            <p >${producto.precio * producto.cantidad}</p>

                        </div>
                        

                    ))}

                    
                    <div className="w-full h-[1px] my-3 bg-red-600"/>
                    
                    {formaDeEntrega === "Envio" ? (
                        <p className="text-center mt-2">Envio: ${costoEnvio}</p>

                    ):(
                        <p className="text-center mt-2">{formaDeEntrega}</p>
                    )}

                    
                    <p className="text-center">{isPayed ? "Está pago" : "Falta pagar"}</p>
                    {!isPayed && (
                        <Fragment>

                            <Link to={'/comprar'} onClick={retomarPago}>
                                <p className="text-center underline ">Ir a pagar</p>
                            </Link>

                        </Fragment>
                    )}
                    <p className="text-center py-1 p-1 my-8  rounded-full border-2 bg-red-600 text-white">Total: ${importeTotal}</p>
                </div>

            </dialog>


        </Fragment>
    )



}



