import { Fragment, useEffect, useState } from "react";


import ProfileCard from "../components/ProfileCard";
import { useLoginContext } from "../context/LoginContext";

import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";



export default function Profile(){

    const {userInfo,allOrdersFromUser} = useLoginContext()
   
    const adminButtons = ['Todos los pedidos','Pre-ordenes','Agregar categoria/producto']

    const [open, setOpen] = useState(false);

  


    useEffect(()=>{
        console.log(allOrdersFromUser)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    return(
        <Fragment>
            <div className="flex flex-col p-5">

                <Link to={'/'} >
                    <MdArrowBackIosNew size={30} className="mb-5"/>
                </Link>

                <ProfileCard userInfo={userInfo} />

                {userInfo.rol === 'cliente' && (

                <div className="flex flex-col p-5 pt-9">
                    <span className="pt-8 pb-8" >PRE-ORDENES EN REVISION</span>
                    <span className="pt-8 pb-8" >Pedidos de {userInfo.username}</span>

                </div>
                )}



                
                {userInfo.rol === 'admin' && (

                <div className="flex flex-col md:flex-row w-full justify-around pt-10 gap-x-20 gap-y-10 flex-wrap">

                    {adminButtons.map(button=>{

                        let dirToGo

                        if(button === "Todos los pedidos") dirToGo = "/TodosLosPedidos"
                        if(button === "Pre-ordenes") dirToGo = "/PreOrderManagement"
                       


                        return(
                            <Link to={button !== "Agregar categoria/producto" && dirToGo} className="p-2 rounded-lg bg-red-600 cursor-pointer text-center" >
                                {button !== "Agregar categoria/producto" ? (
                                    <Link to={dirToGo} className="p-2 rounded-lg bg-red-600 cursor-pointer text-center" >
                                        <button >{button}</button>
                                    </Link>
                                ) : (
                                    <div className="relative w-fit">
                                    <button
                                      onClick={() => setOpen(!open)}
                                      className="bg-red-600 text-white px-4  rounded-lg shadow-md hover:bg-red-700 transition"
                                    >
                                      Agregar categoría/producto
                                    </button>
                              
                                    {open && (
                                      <div className="absolute z-10 mt-2 w-full bg-white border border-red-500 rounded-lg ">
                                        <Link to={"/CreateAndEditProduct"} >
                                            <button className="cursor-pointer w-full px-4 py-2 text-left  text-red-600">
                                            Producto
                                            </button>
                                        </Link>

                                        <Link to={"/CreateAndEditProduct"} >
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