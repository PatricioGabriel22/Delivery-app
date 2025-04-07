/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react"

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

    const WSSmanager = import.meta.env.MODE === 'development' ? 'ws://localhost:4000' : 'wss://delivery-app-0lcx.onrender.com'

    const [userInfo,setUserInfo] = useState(JSON.parse(sessionStorage.getItem('userInfo')) || false)



    return(
        <loginContext.Provider value={{

            renderORLocalURL,
            WSSmanager,

            userInfo,
            setUserInfo



        }}>



        {children}
        </loginContext.Provider>
    )
}




