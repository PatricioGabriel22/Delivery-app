import {Fragment, useEffect, useState } from "react"
import {Link} from 'react-router-dom'

import axios from 'axios'

import { useShoppingContext } from "@context/ShoppingContext"
import { useLoginContext } from "@context/LoginContext";
import { useCatalogContext } from "@context/CatalogContext";


import { RiDeleteBin6Line } from "react-icons/ri"
import { MdArrowBackIosNew } from "react-icons/md";
import {FadeLoader} from 'react-spinners'
import { FaCarSide } from "react-icons/fa6";
import { FaShop } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import { FaFaceSadCry } from "react-icons/fa6";
import { GiCook } from "react-icons/gi";

import toast from "react-hot-toast";

import { decidirCostoEnvio } from "../../utils/envioFunctions"
import { ccapitalizer_3000 } from "../../utils/capitalize"


import ProfileCard from "@components/common/ProfileCard"
import BannerCloseLogo from "@components/common/BannerCloseLogo"
import CancelarCompraBTN from "../../components/user/CancelarCompraBTN";





export default function CarritoConfirm(){
    const {renderORLocalURL,userInfo} = useLoginContext()
    
    const {carrito, importeTotal,setImporteTotal,cartHandler,buyBTN,
        loading,setLoading,responseFromServer,setResponseFromServer
    } = useShoppingContext()

    const {catalogoDelBistro} = useCatalogContext()

    const [edit,setEdit] = useState(false)

    const [changeDeliveryColor,setChangeDeliveryColor] = useState()

    const [deliveryMethod,setDeliveryMethod] = useState("Envio")

    const [listaDeCompras, setListaDeCompras] = useState([]);
    
    const [chekcInfoBTN,setChekcInfoBTN] = useState(false)

    
    setImporteTotal(listaDeCompras.reduce((acc,curr)=>acc+curr.precio*curr.cantidad,0) + decidirCostoEnvio(deliveryMethod,userInfo.localidad))


    
    //aca en vez de carrito me tengo que armar otro carrito o lista que contenga lo que esta comprando con el precio
    //deberia buscar por nombre d eprducto en la lista grande que me viene de la DB para poner el precio

    



    function confirmarOrdenConElLocal(){
        setLoading(prev =>{ 
            localStorage.setItem('loadingPreOrder',JSON.stringify(!prev))
            return JSON.parse(localStorage.getItem('loadingPreOrder'))
        })


        const payload = {
            userInfo,
            preOrderPayload: listaDeCompras,
            costoEnvio:decidirCostoEnvio(deliveryMethod,userInfo.localidad),
            deliveryMethod,
            importeTotal:importeTotal
        }


        toast.promise(axios.post(`${renderORLocalURL}/sendPreOrder`,payload,{withCredentials:true}),
            {
               loading: 'Realizando pre-orden',
               success: (res) => res.data?.message || 'Pre-orden enviada con éxito!',
               error: (err) => {
                
                setTimeout(()=>{
                    setLoading(prev =>{ 
                        localStorage.setItem('loadingPreOrder',JSON.stringify(!prev))
                        return JSON.parse(localStorage.getItem('loadingPreOrder'))
                        })
                },2000)


                return err.response?.data?.message || 'Error al enviar la pre-orden.'},
             },
             {
                // OPCIONES GLOBALES
                success: {
                  icon: '✅',
                  position: 'bottom-center',
                  duration: 4000,
                },
                error: {
                  icon: '📢',
                  position: 'bottom-center',
                  duration: 7000,
                  style: {
                    border: '1px solid red',
                    padding: '16px',
                    color: 'black',
                  }
                },
                loading: {
                  icon: '🕓',
                  position: 'bottom-center',
                }
              }
        )




    }




        
    useEffect(() => {
        setListaDeCompras(
            carrito.map(producto => {
                const productoEnLista = catalogoDelBistro.find(productInList => productInList.nombre === producto.nombre)
                
                return {
                    ...producto,
                    precio: productoEnLista ? productoEnLista.precio : producto.precio,
                };
            })
        );

    }, [carrito,catalogoDelBistro]); // Se ejecuta cada vez que cambia el carrito


   




    return(
        <div className={`flex flex-col justify-center items-center  text-black p-4 md:w-xl m-auto  ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>

            <button 
                className={`bg-red-600 text-white p-4 mb-9 rounded-full  cursor-pointer hover:border-1 hover:border-white ${chekcInfoBTN? "hidden" :"text-lg" } ${loading || buyBTN? "hidden" :"" }`}
                onClick={()=>{setChekcInfoBTN(prev=>!prev)}}
            >{`${chekcInfoBTN? "" :"Modificar informacion de entrega" }`}</button>
            
            {chekcInfoBTN && (
                <Fragment>
                    
                    <div className="w-full">

                        <BannerCloseLogo close={()=>{setChekcInfoBTN(prev=>!prev)}} />
                        <ProfileCard userInfo={userInfo}/>
                    </div>
                   
                </Fragment>
            )}



            <div className={`flex flex-col ${listaDeCompras.length>0? "h-[250px]" : null }  overflow-x-hidden items-center text-black p-4 md:w-fit m-auto`}>

                {listaDeCompras?.map((item,index)=>(
                    <div key={index} className="flex flex-row items-center text-center  justify-around w-full bg-white shadow-md rounded-lg p-2 mb-2">

                        {/* Cantidad (opcional) */}
                        {item.cantidad && (
                            <p className="text-red-600 font-bold w-1/3 text-lg">{item.cantidad}x</p>
                        )}
                        
                        {/* Nombre del Producto */}

                        <p className="font-medium text-lg w-3/3 text-start">{ccapitalizer_3000(item.nombre)}</p>

                        {/* Precio */}
                        <p className="text-gray-700 font-semibold w-1/3 text-lg">${item.precio * item.cantidad}</p>


                        <RiDeleteBin6Line  
                            size={45} 
                            className={`${edit? "block":"invisible"}`}
                            onClick={()=>cartHandler(carrito,"delete",item.nombre,item.precio)}
                            />

                    </div>
                
                
                ))}
            </div>
            <div className="flex flex-col w-full mt-9 m-auto slef-center">
            


                <div className={`flex flex-col w-full 
                    ${loading ? "opacity-50 pointer-events-none" : "opacity-100"} 
                    ${buyBTN ? "pointer-events-none":""}
                    `}>
                            
                    {/* Opciones de retiro/envío */}
                    <div className="flex flex-row justify-center items-end  bg-gray-200 w-full gap-x-7 text-end font-medium rounded-full shadow-lg">

                        <div className={`flex flex-row items-center justify-center gap-1 p-1 ${ changeDeliveryColor ? "bg-sky-500 rounded-2xl" : ""} `}
                            onClick={() => {
                                setChangeDeliveryColor(true)
                                setDeliveryMethod('Retiro en el local')
                                }}>
                                <FaShop size={20} />
                                <p>Retirar en el local</p>
                        </div>
                        
                        <div className={`flex flex-row items-center justify-center gap-1 p-1 ${changeDeliveryColor ? "" : "bg-red-500 rounded-2xl"}`}
                            onClick={() => {
                                setChangeDeliveryColor(false)
                                setDeliveryMethod("Envio")}}>

                                <FaCarSide size={20} />
                                <p>Envio: ${decidirCostoEnvio("Envio",userInfo.localidad)}</p>
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
                            onClick={() => {
                                confirmarOrdenConElLocal()
                                setResponseFromServer(null)
                                }}>
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
                    <GiConfirmed size={60} className="text-green-700 self-center mt-10 "/>
                    <p className="text-white text-center">
                        Su pedido ha sido confirmado.<br />Puede continuar
                    </p>

                    <Link to="/comprar" className="cursor-pointer self-center text-white w-fit p-3 m-1 rounded-full bg-red-700">
                        Ir a pagar
                    </Link>

                    <CancelarCompraBTN pedidoID={localStorage.getItem('pedidoID')} preOrdenID={localStorage.getItem('preOrdenID')}/>
                </Fragment>

                    ):("")}



                    {responseFromServer?.canceled && (
                        <div className="w-[90%] text-lg text-white p-3 gap-y-10 mt-10 gap-3 rounded flex flex-col items-center self-center ">
                            <FaFaceSadCry  size={90}/>
                            Lo sentimos, hubo un problema con su pre-orden. <br/>Sin embargo, puede editarla y probar otras alternativas

                            {responseFromServer?.msgDeSugerencia && (
                                <div className="w-full text-justify bg-white text-black  rounded p-2">
                                    <span className="flex justify-between items-center gap-2 text-lg font-semibold"> 
                                        El local sugiere: <GiCook  size={35}/> </span>
                                    <p className="mt-3">{responseFromServer.msgDeSugerencia}</p>
                                </div>
                            )}

                            <span className="text-center ">Esta pre-orden se cancela automaticamente por falta de producto sin costo alguno</span>

                        </div>
                    )} 

            </div>

        </div>
    )
}
