/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react"

import axios from 'axios'
import { useLoginContext } from "./LoginContext"
import { useConfirmedOrders } from "./SWR"






const ordersContext = createContext()


export const useOrdersContext = ()=>{
    const contextHook = useContext(ordersContext)
    if (!contextHook){
        throw new Error("Este hook se usa dentro de un provider")
    }
    return contextHook


}



export function OrderProvider({children}){

    const {renderORLocalURL,userInfo} = useLoginContext()


    const [allPreOrdersFromAdmin,setAllPreOrdersFromAdmin] = useState()
    const [urlConfirmedOrders,setUrlConfirmedOrders] = useState()


    
    useEffect(()=>{
        if(userInfo){
            const rol = userInfo.rol === 'admin' ? userInfo.rol: "cliente"
            const aux = `${renderORLocalURL}/getAllOrders/${userInfo.id}?rol=${rol}`
            setUrlConfirmedOrders(aux)

        }
    },[userInfo])


    async function AdminPreOrdersData(){

        if(!userInfo.rol) return
            
        try {
            
            const res = await axios.get(`${renderORLocalURL}/AdminPreOrders/${userInfo.id}`,{withCredentials:true})
    
            if(!res) return
    
            if(res.data){
    
                setAllPreOrdersFromAdmin(res.data)
            }
        } catch (error) {
        console.log(error)   
        }
        

    }


    const { confirmedOrders, isLoading, isError, refresh } = useConfirmedOrders(userInfo,urlConfirmedOrders);



    return(
        <ordersContext.Provider value={{
            AdminPreOrdersData,
           
            
            allPreOrdersFromAdmin,
            setAllPreOrdersFromAdmin,


            confirmedOrders, isLoading, isError, refresh

        }}>



        {children}
        </ordersContext.Provider>
    )
}




