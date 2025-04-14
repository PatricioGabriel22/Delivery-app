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

    const [allOrdersFromUser,setAllOrdersFromUser] = useState()

    axios.get(`${renderORLocalURL}/getAllPreOrders`,{withCredentials:true}).then((res)=>{

        // const userOrdes = res.data.filter(data=> data.userInfo.id === userInfo.id)

        setAllOrdersFromUser(res.data)

        
    })

    return(
        <loginContext.Provider value={{

            renderORLocalURL,
            

            userInfo,
            setUserInfo,

            allOrdersFromUser,
            setAllOrdersFromUser



        }}>



        {children}
        </loginContext.Provider>
    )
}




