/* eslint-disable no-unused-vars */

import { Fragment, useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import { useLoginContext } from "@context/LoginContext";
import { useOrdersContext } from "@context/OrdersContext";


import ProfileCard from "@components/common/ProfileCard"
import ConfirmedOrdersPannel from "@components/common/ConfirmedOrdersPannel"
import LoggedUsers from "@components/bistro/LoggedUsers"

import { MdArrowBackIosNew } from "react-icons/md";

const bistroButtons = ['Todos los pedidos','Pre-ordenes','Agregar categoria/producto']

export default function Profile(){

    const {userInfo} = useLoginContext()
    // const {confirmedOrders, isLoading, isError, refresh, actionVerMasOrdenes, setPages } = useOrdersContext()

    const [open, setOpen] = useState(false)
    




    // useEffect(()=>{


    //     if(isLoading){
    //         console.log("cargando...")
    //     }else{
    //         console.log("Pedidos cargados!")
    //         console.log(confirmedOrders)
            
    //     }


    // },[confirmedOrders,isLoading])


    return(
        <Fragment>
            <div className="flex flex-col ">

                <ProfileCard userInfo={userInfo} />
                {
                    !userInfo.rol  && (

                        <ConfirmedOrdersPannel/>
                    )
                }
                
                {userInfo.rol === 'bistro'&&  (

                <div className="flex flex-col md:flex-row justify-center flex-wrap  md:justify-around gap-y-5">

                    {bistroButtons.map((button,index)=>{

                        let dirToGo

                        if(button === "Todos los pedidos") dirToGo = "/OrdersHistory"
                        if(button === "Pre-ordenes") dirToGo = "/PreOrderManagement"
                       


                        return(
                            <span  className="flex justify-center   p-2 rounded-lg bg-red-600 cursor-pointer " key={index} >
                                {button !== "Agregar categoria/producto" ? (
                                    <Link to={dirToGo}  >
                                        <button className="cursor-pointer text-center ">{button}</button>
                                    </Link>
                                ) : (
                                    <div className="relative ">
                                        <button
                                        onClick={() => setOpen(!open)}
                                        className="bg-red-600 text-white  rounded-lg  hover:bg-red-700 transition cursor-pointer"
                                        >

                                            Agregar categoría/producto
                                        </button>
                                
                                        {open && (
                                        <div className="absolute z-10  bg-white border border-red-500 rounded-lg ">
                                            <Link to={"/addProduct"} >
                                                <button className="cursor-pointer  px-4 py-2  text-red-600">
                                                Producto
                                                </button>
                                            </Link>

                                            <Link to={"/addCategory"} >
                                                <button className="cursor-pointer  px-4 py-2  text-red-600">
                                                Categoria
                                                </button>
                                            </Link>
                                        </div>
                                        )}
                                  </div>

                                )}
                                
                            </span>



                        )})
                    }
                    <Link to={"/configuraciones"}>

                        <button className="p-2 rounded w-full bg-yellow-300 text-black border-2 border-red-600 hover:cursor-pointer">Configuraciones</button>
                    </Link>
                </div>
                )}
 
                {userInfo.rol && (

                <span className=" mt-10 p-2 self-center md:self-start m-auto ">
                    <LoggedUsers/>
                </span>

                )}  

            </div>
        </Fragment>
    )
}



// socket.on("nuevaOrdenConfirmada", (orden) => {
//     mutate((oldData) => {
//       return {
//         ...oldData, data anterior que me respondio el useSWR
//         allOrders: [orden, ...oldData.allOrders],
//       };
//     }, false); // false para no revalidar con el servidor
//   });












// 📦 mutate() en SWR
// La función mutate() permite actualizar manualmente el caché de SWR, sin necesidad de hacer una nueva petición al servidor.

// ⚡ Tu ejemplo explicado:
// js
// Copiar
// Editar
// socket.on("nuevaOrdenConfirmada", (orden) => {
//   mutate((oldData) => {
//     return {
//       ...oldData,
//       allOrders: [orden, ...oldData.allOrders],
//     };
//   }, false); // false para no revalidar con el servidor
// });
// 🔔 Escucha el evento nuevaOrdenConfirmada desde el servidor vía WebSocket.

// 🧠 Actualiza el caché de SWR con la nueva orden usando una función que recibe el oldData (el valor cacheado anterior).

// 🧩 Agrega la nueva orden al principio del array allOrders.

// 🚫 El segundo argumento en mutate es false, lo cual evita hacer un fetch al backend después de modificar el cache. Así se actualiza instantáneamente sin revalidar.

// ✅ Resultado
// La nueva orden aparece al instante en pantalla.

// No hay peticiones innecesarias al servidor.

// El usuario ve datos actualizados en tiempo real sin sentir demora.

// Es ideal para apps en tiempo real como la tuya. ¿Querés que te ayude a encapsular eso dentro de un SocketProvider o ordersContext para que sea más mantenible?