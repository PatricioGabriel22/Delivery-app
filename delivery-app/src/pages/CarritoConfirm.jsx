import { useEffect, useState } from "react"
import { useShoppingContext } from "../context/ShoppingContext"

import { RiDeleteBin6Line } from "react-icons/ri"
import { MdArrowBackIosNew } from "react-icons/md";

import {FadeLoader} from 'react-spinners'



export default function CarritoConfirm(){

    const {carrito, importeTotal,setImporteTotal,cartHandler} = useShoppingContext()

    const [edit,setEdit] = useState(false)

    const [loading,setLoading] = useState(JSON.parse(sessionStorage.getItem('loadingPreOrder')) || false)

    const ENVIO = 2500
    setImporteTotal(carrito.reduce((acc,curr)=>acc+curr.precio*curr.cantidad,0) + ENVIO)



    function confirmarOrdenConElLocal(){
        setLoading(prev =>{ 
            sessionStorage.setItem('loadingPreOrder',JSON.stringify(!prev))
            return JSON.parse(sessionStorage.getItem('loadingPreOrder'))
        })
        const preOrden = [...carrito]
        preOrden.push({confirmado: false})
        console.log(preOrden)

        //peticion con axios al local

    }
    
    useEffect(()=>{console.log(loading)},[loading])



    return(
        <div className="flex flex-col min-h-screen items-center  text-black p-4 ">

            {carrito.map((item,index)=>(
                <div key={index} className="flex flex-row items-center text-center  justify-around w-full bg-white shadow-md rounded-lg p-4 mb-2">

                    {/* Cantidad (opcional) */}
                    {item.cantidad && (
                        <p className="text-red-600 font-bold w-1/3">{item.cantidad}x</p>
                    )}
                    
                    {/* Nombre del Producto */}

                    <p className="font-medium text-lg w-1/3 text-start ">{item.nombre}</p>

                    {/* Precio */}
                    <p className="text-gray-700 font-semibold w-1/3">${item.precio}</p>


                    <RiDeleteBin6Line  
                        size={20} 
                        className={`${edit? "block":"invisible"}`}
                        onClick={()=>cartHandler(carrito,"delete",item.nombre,item.precio)}
                        />

                </div>
              
              
            ))}
            <div className="flex flex-col w-full ">
                <span className="bg-gray-200 text-end pr-15 font-medium rounded-full shadow-lg">Envio: ${ENVIO}</span>

                <span className=" bg-gray-400 h-[1px] m-2"></span>
                <p className="bg-white text-black rounded-lg w-full mt-5 text-center">TOTAL: ${importeTotal} </p>

                <div className="flex flex-col justify-center">

                    {loading ? (
                        <div className="flex flex-col justify-center">
                            <FadeLoader color="#f90b0b" className="self-center mt-10" />
                            <p className="text-white text-center">El local se encuentra verificando el stock. Podrá seguir comprando cuando su pedido sea confirmado</p>
                        </div>
                    ):(
                        <div className="flex flex-row justify-center">
                            <button 
                                className="cursor-pointer self-center text-white w-fit p-3 m-3 rounded-full bg-red-500 "
                                onClick={()=>setEdit(!edit)}
                            >Editar orden</button>
    
                            <button 
                                className="cursor-pointer self-center text-white w-fit p-3 m-3 rounded-full bg-green-700"
                                onClick={()=>confirmarOrdenConElLocal()}    
                            >Pre-ordenar</button>
                        </div>

                    )}


                     

                </div>
                {/* {carrito[carrito.length-1]?.confirmado  && (

                    <button className="cursor-pointer self-center text-white w-fit p-3 m-3 mt-20 rounded-full bg-red-700">Comprar</button>
                )} */}

            </div>

        </div>
    )
}
