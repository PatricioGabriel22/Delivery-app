/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { IoStorefrontSharp } from "react-icons/io5";
// import { useParams } from "react-router-dom";
import { useLoginContext } from "../../context/LoginContext";
import axios from 'axios'
import { useEffect, useState } from "react";





export default function TiendaStatus(){

    // const {bistroName} = useParams()
    const {userInfo,renderORLocalURL} = useLoginContext()


    const [isOpen,setIsOpen] = useState()

    async function handleStatus(flagStatus){

        try {
            if(flagStatus){
                const res = await axios.get(`${renderORLocalURL}/getTiendaStatus/${userInfo._id}`,{withCredentials:true})
                console.log(res)
                setIsOpen(res.data.tiendaStatus)
                return
            }
            
            if(!flagStatus){
                
                const res = await axios.post(`${renderORLocalURL}/changeTiendaStatus/${userInfo._id}`,{isOpen},{withCredentials:true})
                setIsOpen(res.data.tiendaStatus)
    
                return
            }

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(()=>{handleStatus(true)},[])



    return(
        <div className="flex flex-row items-center gap-x-2 bg-gray-100 border-2 rounded p-2 px-3 text-black cursor-pointer" onClick={()=>handleStatus(false)}>
            <IoStorefrontSharp size={35} className={`${isOpen ? "text-green-500": "text-red-500"}`} />
            <p>{isOpen ? "Local abierto": "Local cerrado"}</p>
        </div>
    )
}