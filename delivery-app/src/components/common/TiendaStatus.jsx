/* eslint-disable react-hooks/exhaustive-deps */

import { IoStorefrontSharp } from "react-icons/io5";
// import { useParams } from "react-router-dom";
import { useLoginContext } from "../../context/LoginContext";
import axios from 'axios'
import { useEffect, useState } from "react";
import { useBistroContext } from "../../context/BistrosContext";
import { useSocketContext } from "../../context/SocketContext";






export default function TiendaStatus(){

    // const {bistroName} = useParams()
    const {userInfo,renderORLocalURL} = useLoginContext()
    const {bistroInfo} = useBistroContext()
    const {socket} = useSocketContext()
    

    const [isOpen,setIsOpen] = useState()

    async function handleStatus(flagStatus){
        const payload = {idRestaurant:bistroInfo._id || userInfo._id}
        try {
            if(flagStatus){
                const res = await axios.get(`${renderORLocalURL}/getTiendaStatus/${payload.idRestaurant}`,{withCredentials:true})
                console.log(res)
                setIsOpen(res.data.tiendaStatus)
                return
            }
            
            if(!flagStatus){
                
                const res = await axios.post(`${renderORLocalURL}/changeTiendaStatus/${payload.idRestaurant}`,{isOpen},{withCredentials:true})
                setIsOpen(res.data.tiendaStatus)
    
                return
            }

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(()=>{

        socket.on('abrir/cerrar-tienda',(data)=>{
            console.log(data)
            setIsOpen(data.isOpen)
        })

    },[])

    useEffect(()=>{handleStatus(true)},[])



    return(
        <div className={`flex flex-row items-center gap-x-2 bg-gray-100 border-2 rounded p-2 px-3 text-black cursor-pointer ${userInfo.rol? "cursor-pointer":"pointer-events-none"}`}
             onClick={()=>handleStatus(false)}>
            <IoStorefrontSharp size={33} className={`${isOpen ? "text-green-500": "text-red-500"}`} />
            <p>{isOpen ? "Local abierto": "Local cerrado"}</p>
        </div>
    )
}