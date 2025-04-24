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



const WSSmanager = import.meta.env.MODE === 'development' ? 'ws://localhost:4000' : 'wss://delivery-app-0lcx.onrender.com'

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
    const {allPreOrdersFromAdmin,AdminPreOrdersData} = useOrdersContext()
    const {setBuyBTN,setLoading,setResponseFromServer} = useShoppingContext()
    const [allPreOrders, setAllPreOrders] = useState([])
    const [acceptedOrders,setAcceptedOrders] = useState([])

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




    
    
    //Gestion de respuestas del servidor
    useEffect(() => {

        if(!userInfo) return

        socket.on('nuevaPreOrdenRecibida',(data)=>{

            setAllPreOrders(prev=>[...prev,data.nuevaPreOrden])
        })


        //preOrderStatus en el admin
        socket.on('preOrderStatus',(data) => {
        
            if(userInfo.rol === 'admin'){

                if(data.accepted){

                //aca saco del array de pre ordenes aquella cuyo id se aceptó y ya no la quiero ver en preordenes
                setAllPreOrders(prev => prev.filter(item=> item._id !== data.id))

                setAcceptedOrders(prev => {
                    //me aseguro que no me repita la orden por si acaso
                    const ordenesPreviasConfirmadas = prev.filter(item=>item._id !== data.id)

                    
                    if(esDeHoy(data.confirmedOrder.createdAt)){

                        return [...ordenesPreviasConfirmadas,data.confirmedOrder]
                    }
                    

                })
                
                }

                if(data.canceled){

                //aca saco del array de pre ordenes aquella cuyo id se aceptó y ya no la quiero ver en preordenes
                setAllPreOrders(prev => prev.filter(item=> item._id !== data.id))
                return
                }
            }else if(!userInfo.rol){
                setLoading(prev =>{ 
                sessionStorage.setItem('loadingPreOrder',JSON.stringify(!prev))
                return JSON.parse(sessionStorage.getItem('loadingPreOrder'))
                })
            
                if(data.accepted){
                    
                    setBuyBTN(prev=>{
                        sessionStorage.setItem('buyBTN',JSON.stringify(!prev))
                        return JSON.parse(sessionStorage.getItem("buyBTN"))
                    })
        
                }
        
                if(data.canceled){
                    setResponseFromServer(data)
                }
            }   


        });

       

        socket.on('finishedOrder',(data)=>{
            console.log(data)
            setAcceptedOrders(prev=>prev.map(item=>{

                if(item._id === data.finishedOrder._id){
                    return {...item, finished: data.finishedOrder.finished}
                }else{
                    return {...item}
                }
            }))
        })

        socket.on('ordenPreparada',(data)=>{
            console.log(data)
            toast.success(data.infoToUser)
        })

        socket.on('deliveredOrder',(data)=>{
            console.log(data)
            setAcceptedOrders(prev=>prev.filter(item=> item._id !== data.deliveredOrder._id))
        })

      
        return () => {
          socket.off('preOrderStatus')
          socket.off('nuevaPreOrdenRecibida')
          socket.off('finishedOrder')
          socket.off('avisoDeOrdenListaCliente')
          socket.off('deliveredOrder')

        };
    }, [userInfo]);



    return(
        <socketContext.Provider value={{
            socket,
            allPreOrders,
            setAllPreOrders,
            acceptedOrders,
            setAcceptedOrders
            
        }}>
            {children}
        </socketContext.Provider>
    )

}