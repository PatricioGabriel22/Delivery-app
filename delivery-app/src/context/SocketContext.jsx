/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react"

// import axios from 'axios'

import { useLoginContext } from "./LoginContext"
import { esDeHoy } from "../utils/dateFunctions"
import { io } from "socket.io-client"
import { useShoppingContext } from "./ShoppingContext"
import toast from "react-hot-toast"
import { useOrdersContext } from "./OrdersContext"
import { Link } from "react-router-dom"
import BannerCloseLogo from "@components/common/BannerCloseLogo"
import { useCatalogContext } from "./CatalogContext"
import {generateNotificationSound, preventStopNotification } from "../utils/soundConfig"



let WSSmanager 

switch(import.meta.env.VITE_VERCEL_ENV){
    case 'production':
        WSSmanager = 'wss://delivery-app-0lcx.onrender.com'
    break

    case 'preview':
        WSSmanager = 'wss://delivery-app-stagingapi.onrender.com'
    break 
    default:
        WSSmanager = 'ws://localhost:4000'

}

const socket = io(WSSmanager,{
  transports:['websocket'],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000
})




const socketContext = createContext()


export const useSocketContext = ()=>{
    const contextHook = useContext(socketContext)
    if (!contextHook){
        throw new Error("Este hook se usa dentro de un provider")
    }
    return contextHook

}


export function SocketProvider({children}){

    const {userInfo} = useLoginContext()
    const {allPreOrdersFromAdmin,AdminPreOrdersData,refreshHistorialOrdenes} = useOrdersContext()
    const {setBuyBTN,setLoading,setResponseFromServer} = useShoppingContext()
    const {refresh} = useCatalogContext() 
    
    

    const [allPreOrders, setAllPreOrders] = useState([])
    const [acceptedOrders,setAcceptedOrders] = useState([])

    const [loggedUsers,setLoggedUsers] = useState([])

    //para mantener viva la conexion al socket, y "rehidrato" la informacion que traigo de la db
    useEffect(()=>{
        if(!socket || !userInfo) return 


        const infoDeConexion = ()=>{
            socket.emit('sesionIniciada', userInfo)

            if(userInfo?.rol === "admin"){
                AdminPreOrdersData()
              }
        }


        if(userInfo){
            //en la primera vez y cada vez que se actualiza la pagina s evuelve a montar este evento nativo de conexion para garantizar que siempre este conectado el usuario
            socket.on('connect',infoDeConexion)

            //aca si ya esta conectado lo vuelvo a lanzar porque puede conectarse incluso antes de que se active el useEeffect
            if(socket.connected){
                infoDeConexion()
            }

        }

        return ()=>{
            socket.off('connect')
        }
    },[userInfo,socket.connected])


    //me traigo las ordenes y las gestiono. Si se actualiza la pagina se vuelve a llamar a la db

    useEffect(() => {

        if (allPreOrdersFromAdmin) {

          setAllPreOrders(allPreOrdersFromAdmin.filter(data => !data.confirmed && esDeHoy(data.createdAt)));
          setAcceptedOrders(allPreOrdersFromAdmin.filter(data => data.confirmed && esDeHoy(data.createdAt)));
        }
    }, [allPreOrdersFromAdmin]);       


    //evento del socket con usuarios conectaodos (usuariosConectados)
    useEffect(()=>{
        socket.on('usuariosConectados',(data)=>{
            
            setLoggedUsers(data) //no hace falta "mergear" estados previos
        })

    },[])

    
    
    //Gestion de respuestas de pre-ordenes (las ubico aca para que toda la app`se entere cuand oentra un pedido)
    useEffect(() => {

        if(!userInfo) return
        let notificationSound = null
        socket.on('nuevaPreOrdenRecibida',(data)=>{

            preventStopNotification(notificationSound)
            notificationSound = generateNotificationSound('/sounds/notificationPreOrder.mp3', 0.7)

            const {username} = data.nuevaPreOrden.userInfo
            const {costoEnvio} = data.nuevaPreOrden

            setAllPreOrders(prev=>[...prev,data.nuevaPreOrden])

            toast.custom((t) => (

                <div className={`${costoEnvio === 0 ? 'bg-sky-300' : 'bg-red-300'} px-5 p-2 rounded shadow-lg   ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
                    
                    <Link to="/PreOrderManagement" className="text-black font-bold flex flex-row items-center gap-x-2 ">
                        <img src="/logoApp.png" className="h-12 w-12"/>
                        <p className="font-medium">Nueva pre-orden de {username}</p>
                    
                    </Link>
                </div>
            ),{duration:1000 * 6})
            

        })


        //preOrderStatus en el admin
        socket.on('preOrderStatus',(data) => {
            
            if(userInfo.rol === 'admin'){

                if(data.accepted){

                    preventStopNotification(notificationSound)
                    notificationSound = null

                    //aca saco del array de pre ordenes aquella cuyo id se aceptó y ya no la quiero ver en preordenes
                    setAllPreOrders(prev => prev.filter(item=> item._id !== data.id))

                    setAcceptedOrders(prev => {
                        //me aseguro que no me repita la orden por si acaso
                        const ordenesPreviasConfirmadas = prev.filter(item=>item._id !== data.id)

                        
                     
                        if(esDeHoy(data.confirmedOrder.createdAt)){
                            return [...ordenesPreviasConfirmadas,data.confirmedOrder]
                        }
                        

                    })


                    refreshHistorialOrdenes((oldData) => {
                     
                        return {
                            ...oldData,
                            allOrders: [data.nuevoPedido, ...oldData.allOrders], //deja mas reciente el de la izquierda
                        };
                    }, false)
                
                }

                if(data.canceled){
                    preventStopNotification(notificationSound)
                    notificationSound = null //limpiamos la referencia a memoria para no usar recursos 

                    //aca saco del array de pre ordenes aquella cuyo id se aceptó y ya no la quiero ver en preordenes
                    setAllPreOrders(prev => prev.filter(item=> item._id !== data.id))
                    return
                }
            }else if(!userInfo.rol){
                setLoading(prev =>{ 
                    if(prev){
                        localStorage.setItem('loadingPreOrder',JSON.stringify(!prev))
                        return JSON.parse(localStorage.getItem('loadingPreOrder'))
                    }
                })
        
                if(data.accepted){
                    localStorage.setItem('pedidoID',JSON.stringify(data.nuevoPedido._id))
                    localStorage.setItem('preOrdenID',JSON.stringify(data.id))

                    setBuyBTN(prev=>{
                        localStorage.setItem('buyBTN',JSON.stringify(!prev))
                        return JSON.parse(localStorage.getItem("buyBTN"))
                    })

                    //refresco la lista de pedidos del usuario/admin
                    refresh((oldData) => {
                        return {
                            ...oldData,
                            allOrders: [data.nuevoPedido, ...oldData.allOrders],
                        };
                        }, false)

            
                }
        
                if(data.canceled){
                    setResponseFromServer(data)
                }
            }   


        });

       socket.on('preOrdenPagoVerificado',(data)=>{
            setAcceptedOrders(prev=>prev.map(item=>{
                if(item._id === data._id){
                    return {...item, paymentMethod: data.paymentMethod}
                }
                return item
            }))
       })

        socket.on('finishedOrder',(data)=>{
            
            setAcceptedOrders(prev=>prev.map(item=>{
                let aux = {...item}
                if(item._id === data.finishedOrder._id){
                    aux = {...item, finished: data.finishedOrder.finished}
                }
                return aux
            }))
        })


        socket.on('deliveredOrder',(data)=>{
          
            setAcceptedOrders(prev=>prev.filter(item=> item._id !== data.deliveredOrder._id))
        })

        socket.on('ordenPreparada',(data)=>{
           
            toast.success(data.infoToUser)
        })

      
        return () => {
            socket.off('nuevaPreOrdenRecibida')
            socket.off('preOrderStatus')
            socket.off('preOrdenPagoVerificado')
            socket.off('finishedOrder')
            socket.off('ordenPreparada')
            socket.off('deliveredOrder')

        };
    }, [userInfo]);


    //detectar nueco producto agregado para toda la app
    useEffect(()=>{
        socket.on('productoAgregado',(data)=>{
            refresh(prevData=>{
              //prevData es la data cruda del hook useSWR
              if(!prevData) return
      
              const newCatalogo = [...prevData.catalogoDelAdmin, data.nuevoProducto]
      
              return {
                ...prevData,
                catalogoDelAdmin: newCatalogo
              }
            },false)
        })

        socket.on('productoEliminado',(data)=>{
            refresh(prevData=>{
                const newCatalogo = prevData.catalogoDelAdmin.filter(producto => producto._id !== data.deletedId)

                return {
                    ...prevData,
                    catalogoDelAdmin: newCatalogo
                }
            })
        })


        return ()=>{
            socket.off('productoAgregado')
            socket.off('productoEliminado')

        }
      
    },[refresh,socket])


    return(
        <socketContext.Provider value={{
            socket,
            allPreOrders,
            setAllPreOrders,
            acceptedOrders,
            setAcceptedOrders,

            loggedUsers,
            
            
        }}>
            {children}
        </socketContext.Provider>
    )

}