/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";


import ProfileCard from "../components/ProfileCard";
import { useLoginContext } from "../context/LoginContext";

import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";



import { IoIosArrowDown } from "react-icons/io";


export default function Profile(){

    const {userInfo,userOrders} = useLoginContext()
   
    const adminButtons = ['Todos los pedidos','Pre-ordenes','Agregar categoria/producto']

    const [open, setOpen] = useState(false);

    useEffect(()=>{

        console.log("Pedidos", userOrders)


    },[])


    return(
        <Fragment>
            <div className="flex flex-col">

                <Link to={'/'} className="p-5 w-full text-start">
                    <MdArrowBackIosNew size={30} />
                </Link>

                <ProfileCard userInfo={userInfo} />

                {!userInfo.rol  && (

                <div className="flex flex-col  p-1 pt-9 w-full md:w-[60%] self-center items-center  ">

                    <h3 className="pt-8 pb-8" >Pedidos de {userInfo.username}</h3>
                    

                    <span className="bg-red-500 w-full h-28 rounded text-black flex  items-center justify-around px-4 shadow-sm">
                        <IoIosArrowDown size={30} className=""/>
                        <p className="text-lg p-1">Fecha: 22/04/99</p>
                        <p className="text-lg p-1">Entrega: Retiro en el local</p>
                        <p className="text-lg p-1 font-semibold">$1999</p>
                    </span>

                </div>
                )}



                
                {userInfo.rol === 'admin' && (

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