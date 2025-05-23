import { Fragment, useMemo, useRef, useState } from "react";
import { useLoginContext } from "@context/LoginContext";
import { useOrdersContext } from "@context/OrdersContext";




import {FadeLoader} from 'react-spinners'
import { IoIosArrowDown } from "react-icons/io";
import { SlRefresh } from "react-icons/sl";
import { VscError } from "react-icons/vsc";


import { verFecha, verHoraYMinutos } from "../../utils/dateFunctions.js";
import ConfirmedOrderModal from "@components/common/ConfirmedOrderModal";
import Loading from "./Loading.jsx";
import Error from "./Error.jsx";




export default function ConfirmedOrdersPannel({targetDate,targetName}){


    const {userInfo} = useLoginContext()
    const {confirmedOrders, isLoading, isError, refresh, actionVerMasOrdenes, setPages } = useOrdersContext()

    
    const dialogRef = useRef(null);
    const [selectedOrder,setSelectedOrder] = useState()

    const abrirModal = (order) => {

        if (!confirmedOrders || confirmedOrders.length === 0 ) return;
        
        setSelectedOrder(order)
        dialogRef.current.showModal(); // Abre el modal
    }

    const cerrarModal = () => {
        dialogRef.current.close(); // Cierra el modal
    }


    useMemo(()=>{
        setSelectedOrder(confirmedOrders[0])
       
    },[confirmedOrders])

   console.log(confirmedOrders)
  
    const filteredOrders = confirmedOrders
    .filter(orderDate=> targetDate ? verFecha(orderDate.createdAt) === targetDate : true)
    .filter(userNameOrder=> targetName ? userNameOrder.userID?.username.includes(targetName)  : true)

    // useMemo(()=>{
    //     totalPedidos(filteredOrders.length)
    // },[totalPedidos,filteredOrders.length])



    return(
        <Fragment>


            {isLoading && (
                <Loading msg={"Cargando pedidos..."} />
            )}

            {isError && (
                <Error msg={"Hubo un error al cargar sus pedidos."} />
            )}

            {!isLoading &&  !isError && (

                <Fragment>

                
                    <h3 className="pt-12  self-center font-bold text-3xl">Ultimos pedidos de {userInfo.username}</h3>


                    <span className="bg-red-700 w-[90%] h-[1px] self-center m-1 my-3"/>

                    <div className="w-full flex justify-around ">

                        <button
                            onClick={()=>setPages(prev=> prev-1 !== 0 ? prev-1 : 1)}
                            className="rounded p-2 bg-gray-700 cursor-pointer">
                            Volver atras
                        </button>

                        <button 
                            onClick={()=>actionVerMasOrdenes()}
                            className="rounded p-2 bg-green-700 cursor-pointer">
                            Ver mas ordenes
                        </button>


                    
                        

                        <div className="flex flex-row gap-x-2 rounded p-2 hover:bg-green-700 cursor-pointer">
                            <p>Actualizar</p>
                            <SlRefresh 
                                size={25} 
                                className="cursor-pointer"
                                onClick={refresh}
                            
                            />
                        </div>
                    </div>

                    

                    <div className="flex flex-col p-1 py-6 w-full  md:w-[60%] self-center items-center overflow-x-hidden">

                        
                        {confirmedOrders.length >0 && filteredOrders
                            .map((confirmedOrder)=>( 
                            
                            <Fragment>
                                
                                <span
                                    onClick={()=>abrirModal(confirmedOrder)} 
                                    className={`${confirmedOrder.formaDeEntrega === 'Envio'? "bg-red-500":"bg-sky-500"} sm:w-full w-[90%] h-20  rounded-2xl text-black flex  items-center justify-between px-4 shadow-sm m-2 cursor-pointer`}>
                                    <IoIosArrowDown size={30} className=""/>

                                    <p className="text-lg p-1 w-1/2 text-center ">{verFecha(confirmedOrder.createdAt)} | {verHoraYMinutos(confirmedOrder.createdAt)}</p>
                                    {userInfo.rol === 'admin'&& (<p className="text-lg p-1 w-1/2 text-center overflow-hidden text-ellipsis whitespace-nowrap">{confirmedOrder.userID?.username}</p>)}
                                    <p className="text-lg p-1 w-1/2 text-center ">{confirmedOrder.formaDeEntrega}</p>
                                    <p className="text-lg p-1 w-1/2  text-end font-semibold">${confirmedOrder.importeTotal}</p>

                                </span>

                                <ConfirmedOrderModal 
                                    ref={dialogRef}
                                    close={cerrarModal}
                                    confirmedOrder={selectedOrder}
                                    
                                />
                            </Fragment>
                        ))}

                    </div>
                </Fragment>
                )}

        </Fragment>
    )
}