/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import axios from 'axios'

import { useLoginContext } from "@context/LoginContext.jsx";
import { useSocketContext } from "@context/SocketContext.jsx";




export default function DeliveryStatus({rol}){


    const {renderORLocalURL} = useLoginContext()
    const {socket} = useSocketContext()
    
    const [auxDelivery,setAuxDelivery] = useState(null)

  async function handleDeliveryStatus(flagChange){
    const payload = {idRestaurant:'6806b8fe2b72a9697aa59e5f'}
    
    try {
      
      
      if(flagChange){
        //Obtengo el estado actual del delivery
        const getRestaurant = await axios.get(`${renderORLocalURL}/getRestaurant/${payload.idRestaurant}`,{withCredentials:true})
        console.log(getRestaurant)
        setAuxDelivery(getRestaurant.data.deliveryStatus)
      }else{
        //modifico el estao del delivery consistentemente en DB
        payload.flagDelivery = auxDelivery
        const changedStatus = await axios.post(`${renderORLocalURL}/cambiarEstadoDelivery`,payload,{withCredentials:true})
        setAuxDelivery(changedStatus.data.deliveryStatus)
      }
      


    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{

    socket.on('cambioDeEstadoDelivery',(data)=>{setAuxDelivery(data)})

  },[])


  useEffect(()=>{handleDeliveryStatus(true)},[])

    return(
        <Fragment>

            
            <button 
                className={`rounded bg-gray-100 text-black p-3 flex flex-row gap-x-2 border-2 border-black ${rol? "cursor-pointer":"pointer-events-none"} `}
                onClick={()=>{handleDeliveryStatus(false);console.log("click")}}
                >
                <span className={`rounded-full p-3 ${auxDelivery ? "bg-green-500":"bg-red-500"} `} />
                <p>{auxDelivery? "Delivery activo":"Sin delivery"}</p>
            </button>   



        </Fragment>
    )
}