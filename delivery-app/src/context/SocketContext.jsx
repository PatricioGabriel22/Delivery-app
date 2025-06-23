/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react"

// import axios from 'axios'

import { useLoginContext } from "./LoginContext"

import { io } from "socket.io-client"
import { useShoppingContext } from "./ShoppingContext"
import toast from "react-hot-toast"
import { useOrdersContext } from "./OrdersContext"
import { Link } from "react-router-dom"

import {generateNotificationSound, preventStopNotification } from "../utils/soundConfig"
import { useBistroContext } from "./BistrosContext"
import { esDeHoy } from "../utils/dateFunctions"
import { useCatalogMaker } from "./SWR"



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

    const {renderORLocalURL,userInfo,bistroInfo,setUserInfo} = useLoginContext()
    const {allPreOrdersFromBistro,BistroPreOrdersData,refreshHistorialOrdenes} = useOrdersContext()
    const {setBuyBTN,setLoading,setResponseFromServer} = useShoppingContext()
    const {refresh} = useCatalogMaker(renderORLocalURL, bistroInfo?._id || userInfo?._id)
     
    const {refreshopenBistros} = useBistroContext()
    
    

    const [allPreOrders, setAllPreOrders] = useState([])
    const [acceptedOrders,setAcceptedOrders] = useState([])

    const [loggedUsers,setLoggedUsers] = useState([])

    //para mantener viva la conexion al socket, y "rehidrato" la informacion que traigo de la db
    useEffect(()=>{
        if(!socket || !userInfo) return 


        const infoDeConexion = ()=>{
            socket.emit('sesionIniciada', userInfo)

            if(userInfo?.rol === "bistro"){
                BistroPreOrdersData()
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


    //me traigo las pre-ordenes y las gestiono. Si se actualiza la pagina se vuelve a llamar a la db
    useEffect(() => {

        if (allPreOrdersFromBistro) {
          setAllPreOrders(allPreOrdersFromBistro.filter(data => !data.confirmed && esDeHoy(data.createdAt)))
          setAcceptedOrders(allPreOrdersFromBistro.filter(data => data.confirmed && esDeHoy(data.createdAt)))
        }
    }, [allPreOrdersFromBistro]);       


    //evento del socket con usuarios conectaodos (usuariosConectados) loggedUsers
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


        //preOrderStatus en el bistro
        socket.on('preOrderStatus',(data) => {
            
            if(userInfo.rol === 'bistro'){

                if(data.accepted){

                    preventStopNotification(notificationSound)
                    notificationSound = null

                    //aca saco del array de pre ordenes aquella cuyo id se aceptó y ya no la quiero ver en preordenes
                    setAllPreOrders(prev => prev.filter(item=> item._id !== data.id))

                    setAcceptedOrders(prev => {
                        //me aseguro que no me repita la orden por si acaso
                        const ordenesPreviasConfirmadas = prev.filter(item=>item._id !== data.id)


                        
                        
                            return [...ordenesPreviasConfirmadas,data.confirmedOrder]
                        
                        

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
                    setAcceptedOrders(prev => prev.filter(item=> item._id !== data.id))
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
                    localStorage.setItem('pedidoID',data.nuevoPedido._id)
                    localStorage.setItem('preOrdenID',data.id)

                    setBuyBTN(prev=>{
                        localStorage.setItem('buyBTN',JSON.stringify(!prev))
                        return JSON.parse(localStorage.getItem("buyBTN"))
                    })

                    //refresco la lista de pedidos del usuario/bistro
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


        socket.on('canceloMiPedido',(data)=>{
            console.log(data)
            setAllPreOrders(prev => prev.filter(item=> item._id !== data.preOrdenID))
            setAcceptedOrders(prev => prev.filter(item=> item._id !== data.preOrdenID))
            toast(data.message,{icon:'⚠️',duration:700 * 10})
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
      
              const newCatalogo = [...prevData.catalogoDelBistro, data.nuevoProducto]
      
              return {
                ...prevData,
                catalogoDelBistro: newCatalogo
              }
            },false)
        })

        socket.on('productoEliminado',(data)=>{
            refresh(prevData=>{
                const newCatalogo = prevData.catalogoDelBistro.filter(producto => producto._id !== data.deletedId)

                return {
                    ...prevData,
                    catalogoDelBistro: newCatalogo
                }
            })
        })


        return ()=>{
            socket.off('productoAgregado')
            socket.off('productoEliminado')

        }
      
    },[refresh,socket])


    //eventos sockets de cambio de estado, edicion de producto, delivery
    useEffect(()=>{

        socket.on('AlterProductStatus', (data) => {
        
        refresh(prevData => {
            if (!prevData) return prevData
        
            const updatedStatuses = prevData.catalogoDelBistro.map(item => {
            if (item._id === data.target._id) {
                return { ...item, disponible: data.target.disponible }
            }
            return item
            })
    
            return {
            ...prevData,
            catalogoDelBistro: updatedStatuses
            }
        }, false) // false para evitar revalidar desde el servidor
        })

        socket.on('cardProductoActualizada',(data)=>{
        refresh(prevData=>{
            const updatedArray = prevData.catalogoDelBistro.map(prevItem=>{

            if(prevItem._id === data._id){
                return {...data}
            }else{
                return{...prevItem}
            }
            })

            return{
            ...prevData,
            catalogoDelBistro:updatedArray
            }

        })
        })

    

        return ()=>{
        socket.off('AlterProductStatus')
        socket.off('cardProductoActualizada')
        
        }

    },[])

    //eventos sockets de cambio de configuraciones
    useEffect(()=>{
        socket.on('nuevaConfiguracion',(data)=>{
            //aca habria que sobreescribir el userInfo (bistro), y el SWR de los bistros
            console.log(data)
            localStorage.setItem('userInfo', JSON.stringify(data))

            

            refreshopenBistros(prevData=>{

                if(!prevData) return
             
                const nuevaData = prevData.openBistros.map(bistro =>{
                    if(bistro._id === data._id){

                        setUserInfo(data)

                        return {...bistro,
                            zonas_delivery:[...data.zonas_delivery],
                            categorias:[...data.categorias],
                            img:data.img
                        }
                    }

                    return {...bistro}
                })

           
                
                return{
                    ...prevData,
                    openBistros:nuevaData
                }
            },{revalidate:false})
        })

        
        
        return ()=>{
            socket.off('nuevaConfiguracion')
        }

    },[])
    


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