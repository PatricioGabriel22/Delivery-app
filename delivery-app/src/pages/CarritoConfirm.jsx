import {Fragment, useEffect, useState } from "react"
import {Link} from 'react-router-dom'
import { useShoppingContext } from "../context/ShoppingContext"
import { useLoginContext } from "../context/LoginContext";

import axios from 'axios'

import { RiDeleteBin6Line } from "react-icons/ri"
import { MdArrowBackIosNew } from "react-icons/md";
import {FadeLoader} from 'react-spinners'
import { FaCarSide } from "react-icons/fa6";
import { FaShop } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import { ListaProductos } from "../utils/productos";




export default function CarritoConfirm(){
    const {renderORLocalURL,userInfo} = useLoginContext()
    const {carrito, importeTotal,setImporteTotal,cartHandler,buyBTN,setBuyBTN, socket} = useShoppingContext()

    const [edit,setEdit] = useState(false)

    const [loading,setLoading] = useState(JSON.parse(sessionStorage.getItem('loadingPreOrder')) || false)

    const [pasaARetirar,setPasaARetirar] = useState()

    const [listaDeCompras, setListaDeCompras] = useState([]);
    
    

    const ENVIO = pasaARetirar? 0 : 2500
    setImporteTotal(listaDeCompras.reduce((acc,curr)=>acc+curr.precio*curr.cantidad,0) + ENVIO)


    
    //aca en vez de carrito me tengo que armar otro carrito o lista que contenga lo que esta comprando con el precio
    //deberia buscar por nombre d eprducto en la lista grande que me viene de la DB para poner el precio

    



    function confirmarOrdenConElLocal(){
        setLoading(prev =>{ 
            sessionStorage.setItem('loadingPreOrder',JSON.stringify(!prev))
            return JSON.parse(sessionStorage.getItem('loadingPreOrder'))
        })


        const payload = {
            userInfo,
            preOrderPayload: listaDeCompras,
            envio:ENVIO,
            importeTotal:importeTotal
        }

        axios.post(`${renderORLocalURL}/sendPreOrder`,payload,{withCredentials:true})

    }


        
    useEffect(() => {
        setListaDeCompras(
            carrito.map(producto => {
                const productoEnLista = ListaProductos.find(productInList => productInList.nombre === producto.nombre);
                return {
                    ...producto,
                    precio: productoEnLista ? productoEnLista.precio : producto.precio,
                };
            })
        );
    }, [carrito]); // Se ejecuta cada vez que cambia el carrito


   
    useEffect(()=>{

        socket.on('checkedPreOrder',(data)=>{
            
            if(data.status){
                sessionStorage.setItem('buyBTN',JSON.stringify(data.status))
                setBuyBTN(JSON.parse(sessionStorage.getItem("buyBTN")))

                setLoading(prev =>{ 
                    sessionStorage.setItem('loadingPreOrder',JSON.stringify(!prev))
                    return JSON.parse(sessionStorage.getItem('loadingPreOrder'))
                })
            }



            console.log("order actualizada ", data)
        })

        return ()=>{
            socket.off('checkedPreOrder')
        }

    },[socket,setBuyBTN])



    return(
        <div className={`flex flex-col min-h-screen items-center  text-black p-4 md:w-xl m-auto  
            ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>

            {listaDeCompras?.map((item,index)=>(
                <div key={index} className="flex flex-row items-center text-center  justify-around w-full bg-white shadow-md rounded-lg p-4 mb-2">

                    {/* Cantidad (opcional) */}
                    {item.cantidad && (
                        <p className="text-red-600 font-bold w-1/3">{item.cantidad}x</p>
                    )}
                    
                    {/* Nombre del Producto */}

                    <p className="font-medium text-lg w-1/3 text-start ">{item.nombre}</p>

                    {/* Precio */}
                    <p className="text-gray-700 font-semibold w-1/3">${item.precio * item.cantidad}</p>


                    <RiDeleteBin6Line  
                        size={20} 
                        className={`${edit? "block":"invisible"}`}
                        onClick={()=>cartHandler(carrito,"delete",item.nombre,item.precio)}
                        />

                </div>
              
              
            ))}
            <div className="flex flex-col w-full ">
              


                <div className={`flex flex-col w-full 
                    ${loading ? "opacity-50 pointer-events-none" : "opacity-100"} 
                    ${buyBTN ? "pointer-events-none":""}
                    `}>
                            
                    {/* Opciones de retiro/envío */}
                    <div className="flex flex-row justify-center items-end  bg-gray-200 w-full gap-x-7 text-end font-medium rounded-full shadow-lg">

                        <div className={`flex flex-row items-center justify-center gap-1 p-1 ${ pasaARetirar ? "bg-sky-500 rounded-2xl" : ""} `}
                            onClick={() => setPasaARetirar(true)}>
                                <FaShop size={20} />
                                <p>Retirar en el local</p>
                        </div>
                        
                        <div className={`flex flex-row items-center justify-center gap-1 p-1 ${pasaARetirar ? "" : "bg-red-500 rounded-2xl"}`}
                            onClick={() => setPasaARetirar(false)}>
                                <FaCarSide size={20} />
                                <p>Envio: $2500</p>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-row justify-center gap-3 mt-3">
                        <button
                            className="cursor-pointer text-white w-fit p-3 rounded-full bg-red-500"
                            onClick={() => setEdit(!edit)}>
                                Editar orden
                        </button>

                        <button
                            className={`cursor-pointer text-white w-fit p-3 rounded-full bg-green-700 ${carrito.length >0 ? "": "pointer-events-none"} `}
                            onClick={() => confirmarOrdenConElLocal()}>
                                Pre-ordenar
                        </button>
                    </div>

                    {/* Separador */}
                    <span className="bg-gray-400 h-[1px] m-2"></span>

                    {/* Total */}
                    <p className={`bg-white text-black rounded-lg w-full mt-5 text-center `}>
                        TOTAL: ${importeTotal}
                    </p>
                </div>


              

                    {loading ? (
                        <div className="flex flex-col justify-center w-full">
                            <FadeLoader color="#f90b0b" className="self-center mt-10" />
                            <p className="text-white text-center">
                                El local se encuentra verificando el stock. Podrá seguir comprando cuando su pedido sea confirmado
                            </p>

                        </div>
                    ) : ("")}

                    {buyBTN ? (
                        <Fragment>
                            <GiConfirmed size={60} className="text-green-700 self-center mt-10"/>
                            <p className="text-white text-center">
                                Su pedido ha sido confirmado.<br />Puede continuar
                            </p>
                        </Fragment>

                    ):("")}

                    {buyBTN  && (
                        
                        <Link to="/confirmar-direccion-y-comprar" className="cursor-pointer self-center text-white w-fit p-3 m-3 mt-20 rounded-full bg-red-700">
                            Confirmar direccion y comprar
                        </Link>
                    )}

            </div>

        </div>
    )
}
