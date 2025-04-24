/* eslint-disable no-unused-vars */

import { Fragment, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import ProfileCard from "../components/ProfileCard";
import { useLoginContext } from "../context/LoginContext";
import { useOrdersContext } from "../context/OrdersContext";
import { useConfirmedOrders } from "../context/SWR";

import { MdArrowBackIosNew } from "react-icons/md";
import {FadeLoader} from 'react-spinners'



import { IoIosArrowDown } from "react-icons/io";


export default function Profile(){

    const {userInfo} = useLoginContext()
    const {confirmedOrders, isLoading, isError, refresh } = useOrdersContext()




    const [open, setOpen] = useState(false)



    const adminButtons = ['Todos los pedidos','Pre-ordenes','Agregar categoria/producto']


    useEffect(()=>{

        if(isLoading){
            console.log("cargando...")
        }else{

            console.log("Pedidos", confirmedOrders)
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

                        <p>Cargando pedidos...</p>

                    </span>
                )}

                {!userInfo.rol  && !isLoading &&  (

                    <Fragment>

                        <h3 className="pt-12 self-center font-bold text-3xl">Pedidos de {userInfo.username}</h3>
                        <div className="flex flex-col p-1 py-6 w-full  md:w-[60%] self-center items-center ">

                            
                            {confirmedOrders.map((confirmedOrder)=>( 

                                <span 
                                className={`${confirmedOrder.formaDeEntrega === 'Envio'? "bg-red-500":"bg-sky-500"} sm:w-full w-[90%] h-20  rounded-2xl text-black flex  items-center justify-around px-4 shadow-sm m-2 cursor-pointer`}>
                                    <IoIosArrowDown size={30} className=""/>
                                    <p className="text-lg p-1 w-1/2 text-center ">Fecha: 22/04/99</p>
                                    <p className="text-lg p-1 w-1/2 text-center ">{confirmedOrder.formaDeEntrega}</p>
                                    <p className="text-lg p-1 w-1/2  text-end font-semibold">$1999</p>
                                </span>
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