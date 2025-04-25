/* eslint-disable no-unused-vars */

import { Fragment, useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import ProfileCard from "../components/ProfileCard";
import { useLoginContext } from "../context/LoginContext";
import { useOrdersContext } from "../context/OrdersContext";
import { useConfirmedOrders } from "../context/SWR";

import { MdArrowBackIosNew } from "react-icons/md";
import {FadeLoader} from 'react-spinners'
import { IoIosArrowDown } from "react-icons/io";
import { SlRefresh } from "react-icons/sl";
import { VscError } from "react-icons/vsc";


import { verFecha, verHoraYMinutos } from "../utils/dateFunctions";
import ConfirmedOrderModal from "../components/ConfirmedOrderModal";


const adminButtons = ['Todos los pedidos','Pre-ordenes','Agregar categoria/producto']

export default function Profile(){

    const {userInfo} = useLoginContext()
    const {confirmedOrders, isLoading, isError, refresh, actionVerMasOrdenes, setPages } = useOrdersContext()

    const [open, setOpen] = useState(false)
    
    const dialogRef = useRef(null);
    const [selectedOrder,setSelectedOrder] = useState()

    const abrirModal = (order) => {

        if (!confirmedOrders || confirmedOrders.length === 0 ) return;
        
        setSelectedOrder(order)
        dialogRef.current.showModal(); // Abre el modal
    };

    const cerrarModal = () => {
        dialogRef.current.close(); // Cierra el modal
    };




    useEffect(()=>{


        if(isLoading){
            console.log("cargando...")
        }else{
            console.log(confirmedOrders)
            console.log("Pedidos cargados!")

            setSelectedOrder(confirmedOrders[0])
        }


    },[confirmedOrders,isLoading])


    return(
        <Fragment>
            <div className="flex flex-col">

                <Link to={'/'} className="p-5 w-full text-start">
                    <MdArrowBackIosNew size={30} />
                </Link>

                <ProfileCard userInfo={userInfo} />

                {isLoading && (
                    <span className="flex flex-col w-full h-full items-center justify-center">

                        <FadeLoader color="#f90b0b" className="self-center mt-10" />

                        <p className="text-lg">Cargando pedidos...</p>

                    </span>
                )}

                {isError && (
                    <span className="flex flex-col w-full h-full items-center justify-center">

                        <VscError color="#f90b0b"  className="self-center mt-10 text-9xl"/>
                        <p className="text-lg">Hubo un error al cargar sus pedidos.</p>

                    </span>
                )}

                {!userInfo.rol  && !isLoading &&  !isError && (

                    <Fragment>

                    
                        <h3 className="pt-12  self-center font-bold text-3xl">Pedidos de {userInfo.username}</h3>


                        <span className="bg-red-700 w-[90%] h-[1px] self-center m-1 my-3"/>

                        <div className="w-full flex justify-around ">
 

                            {confirmedOrders.length === 5 ? (
                                    <button 
                                        onClick={()=>actionVerMasOrdenes()}
                                        className="rounded p-2 hover:bg-green-700 cursor-pointer">
                                        Ver mas ordenes
                                    </button>
                            ) : (
                                    <button
                                        onClick={()=>setPages(1)}
                                        className="rounded p-2 hover:bg-gray-700 cursor-pointer">
                                        Vovler al principio
                                    </button>
                            )}

                            <div className="flex flex-row gap-x-2 rounded p-2 hover:bg-green-700 cursor-pointer">
                                <p>Actualizar</p>
                                <SlRefresh 
                                    size={25} 
                                    className="cursor-pointer"
                                    onClick={refresh}
                                
                                />
                            </div>
                        </div>

                      

                        <div className="flex flex-col p-1 py-6 w-full  md:w-[60%] self-center items-center ">

                            
                            {confirmedOrders.length >0 && confirmedOrders.map((confirmedOrder)=>( 
                                <Fragment>

                                    <span
                                        onClick={()=>abrirModal(confirmedOrder)} 
                                        className={`${confirmedOrder.formaDeEntrega === 'Envio'? "bg-red-500":"bg-sky-500"} sm:w-full w-[90%] h-20  rounded-2xl text-black flex  items-center justify-between px-4 shadow-sm m-2 cursor-pointer`}>
                                        <IoIosArrowDown size={30} className=""/>
                                        <p className="text-lg p-1 w-1/2 text-center ">{verFecha(confirmedOrder.createdAt)} | {verHoraYMinutos(confirmedOrder.createdAt)}</p>
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



                
                {userInfo.rol === 'admin'&& !isLoading  && (

                <div className="flex flex-col md:flex-row w-full justify-around pt-10 gap-x-20 gap-y-10 flex-wrap c">

                    {adminButtons.map(button=>{

                        let dirToGo

                        if(button === "Todos los pedidos") dirToGo = "/OrdersHistory"
                        if(button === "Pre-ordenes") dirToGo = "/PreOrderManagement"
                       


                        return(
                            <Link to={button !== "Agregar categoria/producto" && dirToGo} className="p-2 rounded-lg bg-red-600 cursor-pointer text-center" >
                                {button !== "Agregar categoria/producto" ? (
                                    <Link to={dirToGo} className="p-2 rounded-lg bg-red-600  text-center " >
                                        <button className="cursor-pointer">{button}</button>
                                    </Link>
                                ) : (
                                    <div className="relative w-fit m-auto">
                                        <button
                                        onClick={() => setOpen(!open)}
                                        className="bg-red-600 text-white px-4  rounded-lg shadow-md hover:bg-red-700 transition cursor-pointer"
                                        >
                                        Agregar categoría/producto
                                        </button>
                                
                                        {open && (
                                        <div className="absolute z-10 mt-2 w-full bg-white border border-red-500 rounded-lg ">
                                            <Link to={"/addProduct"} >
                                                <button className="cursor-pointer w-full px-4 py-2 text-left  text-red-600">
                                                Producto
                                                </button>
                                            </Link>

                                            <Link to={"/addCategory"} >
                                                <button className="cursor-pointer w-full px-4 py-2 text-left  text-red-600">
                                                Categoria
                                                </button>
                                            </Link>
                                        </div>
                                        )}
                                  </div>

                                )}
                                
                            </Link>
                        )})
                    }


                    

                </div>
                )}

            </div>
        </Fragment>
    )
}