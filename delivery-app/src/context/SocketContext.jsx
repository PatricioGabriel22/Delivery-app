/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react"

// import axios from 'axios'

import { useLoginContext } from "./LoginContext"
import { esDeHoy } from "../utils/dateFunctions"
import { io } from "socket.io-client"



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
    const [allPreOrders, setAllPreOrders] = useState([])
    const [acceptedOrders,setAcceptedOrders] = useState([])

    //para mantener viva la conexion al socket
    useEffect(()=>{
        if(!socket) return 

        if(userInfo){
            //en la primera vez y cada vez que se actualiza la pagina s evuelve a montar este evento nativo de conexion para garantizar que siempre este conectado el usuario
            socket.on('connect',()=>{
                console.log(socket)
                socket.emit('sesionIniciada', userInfo)
            })


        }

        return ()=>{
            socket.off('connect')
        }
    },[userInfo,socket.connected])




    useEffect(() => {
        socket.on('preOrderStatus', (data) => {
          console.log(data);
      
          if (data.status) {

            //aca saco del array de pre ordenes aquella cuyo id se aceptó y ya no la quiero ver en preordenes
            setAllPreOrders(prev => prev.filter(item=> item._id !== data.id))

            setAcceptedOrders(prev => {
                //me aseguro que no me repita la orden por si acaso
                const targetSinDuplicar = prev.filter(item=>item._id !== data.id)

                if(esDeHoy(data.confirmedOrder.createdAt)){

                    return [...targetSinDuplicar,data.confirmedOrder]
                }

            })

          }
        });


        socket.on('nuevaPreOrdenRecibida',(data)=>{
            console.log(data)
            setAllPreOrders(prev=>[...prev,data.nuevaPreOrden])
        })

        socket.on('finishedOrder',(data)=>{
            console.log(data)
            setAcceptedOrders(prev=>prev.map(item=>{

                if(item._id === data.finishedOrder._id){
                    return {...item, finished: data.finishedOrder.finished}
                }else{
                    return item
                }
            }))
        })

        socket.on('deliveredOrder',(data)=>{
            console.log(data)
            setAcceptedOrders(prev=>prev.filter(item=> item._id !== data.deliveredOrder._id))
        })

      
        return () => {
          socket.off('preOrderStatus')
          socket.off('nuevaPreOrdenRecibida')
          socket.off('finishedOrder')
          socket.off('deliveredOrder')

        };
    }, [allPreOrders,acceptedOrders]);



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