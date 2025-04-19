
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react"

import axios from 'axios'

const loginContext = createContext()


export const useLoginContext = ()=>{
    const contextHook = useContext(loginContext)
    if (!contextHook){
        throw new Error("Este hook se usa dentro de un provider")
    }
    return contextHook


}






export function LoginProvider({children}){

    const renderORLocalURL = import.meta.env.MODE === 'development' ? 'http://localhost:4000' : 'https://delivery-app-0lcx.onrender.com'


    const [userInfo,setUserInfo] = useState(JSON.parse(sessionStorage.getItem('userInfo')) || false)

    const [allOrdersFromAdmin,setAllOrdersFromAdmin] = useState()

    //modificar el endpoint para tener todas las ordenes del local o  todas las del usuario



    function getOrdersAllOrdersData(){

        try {
            
            axios.post(`${renderORLocalURL}/getAllPreOrders/${userInfo.id}`,{rol:userInfo.rol},{withCredentials:true}).then((res)=>{
                
                console.log(res.data)
                setAllOrdersFromAdmin(res.data)
        
            })

        } catch (error) {
            console.log(error)
        }
    }






 


        

    return(
        <loginContext.Provider value={{

            renderORLocalURL,
            

            userInfo,
            setUserInfo,

            allOrdersFromAdmin,
            setAllOrdersFromAdmin,
            getOrdersAllOrdersData
            
            



        }}>



        {children}
        </loginContext.Provider>
    )
}




