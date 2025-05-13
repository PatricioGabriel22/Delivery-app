/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react"

import axios from 'axios'
import { useLoginContext } from "./LoginContext"
import { useHistorialOrdenes } from "./SWR"






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

    const [flagPagination,setFlagPagination] = useState(true)
    const [pages,setPages] = useState(1)
    const [limite,setLimite] = useState(1)

   
    
    useEffect(()=>{

        if(!userInfo) return
        
        if(!userInfo.rol){
            const rol = "cliente"
            const aux = `${renderORLocalURL}/getAllOrders/${userInfo.id}?rol=${rol}`
            setUrlConfirmedOrders(aux)
            setLimite(5)
            
        }

        if(userInfo.rol === "admin"){
            const rol = "admin"
            const aux = `${renderORLocalURL}/getAllOrders/${userInfo.id}?rol=${rol}`
            setUrlConfirmedOrders(aux)
            setLimite(20)
            
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


    function actionVerMasOrdenes(){

        const paginaFinal = totalPages+1

        if(pages > paginaFinal) return

        setPages(prev=>prev+1)
    }


    const { confirmedOrders, isLoading, isError, refresh, totalPages} = useHistorialOrdenes(userInfo,urlConfirmedOrders,flagPagination,pages,limite)

    
    
    

    return(
        <ordersContext.Provider value={{
            AdminPreOrdersData,
           
            
            allPreOrdersFromAdmin,
            setAllPreOrdersFromAdmin,


            confirmedOrders, isLoading, isError, refresh,
            actionVerMasOrdenes,
            setPages,setLimite,setFlagPagination

        }}>



        {children}
        </ordersContext.Provider>
    )
}




