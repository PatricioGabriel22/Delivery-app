
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

    const [allPreOrdersFromAdmin,setAllPreOrdersFromAdmin] = useState()
    const [allOrdersFromAdmin,setAllOrdersFromAdmin] = useState()


    const [userOrders,setUserOrders] = useState()




    //modificar el endpoint para tener todas las ordenes del local o  todas las del usuario



    function getAllPreOrdersData(){

        if(!userInfo.rol) return

        try {
            
            axios.get(`${renderORLocalURL}/getAllPreOrders/${userInfo.id}?rol=${userInfo.rol}`,{withCredentials:true})
            .then((res)=>{
                
  

                setAllPreOrdersFromAdmin(res.data)
                
        
            })

        } catch (error) {
            console.log(error)
        }
    }


    function getAllOrdersData(){

        try {
            
            axios.get(`${renderORLocalURL}/getAllOrders/${userInfo.id}?rol=${userInfo.rol}`,{withCredentials:true})
            .then((res)=>{
                
                if(!userInfo.rol){
                    setUserOrders(res.data)
                }else if(userInfo.rol === 'admin'){

                    setAllOrdersFromAdmin(res.data)
                }
        
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
            userOrders,

            allPreOrdersFromAdmin,
            allOrdersFromAdmin,

            setAllPreOrdersFromAdmin,

            getAllPreOrdersData,
            getAllOrdersData

            
            



        }}>



        {children}
        </loginContext.Provider>
    )
}




