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


    const { confirmedOrders, isLoading, isError, refresh } = useConfirmedOrders(userInfo,urlConfirmedOrders);
    
    useEffect(()=>{
        if(userInfo){
            const aux = `${renderORLocalURL}/getAllOrders/${userInfo.id}?rol=${userInfo.rol}`
            setUrlConfirmedOrders(aux)

        }
    },[userInfo])

    async function getAllPreOrdersData(){

        if(!userInfo.rol) return
            
        const res = await axios.get(urlConfirmedOrders,{withCredentials:true})

        if(!res) return

        if(res.data){
            setAllPreOrdersFromAdmin(res.data)
        }
        

    }








    


 


        

    return(
        <ordersContext.Provider value={{
            getAllPreOrdersData,
           
            
            allPreOrdersFromAdmin,
            setAllPreOrdersFromAdmin,


            confirmedOrders, isLoading, isError, refresh

        }}>



        {children}
        </ordersContext.Provider>
    )
}




