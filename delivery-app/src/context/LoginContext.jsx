
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

    //para aceder a las variables de entorno de VITE import.meta.env
    
    const renderORLocalURL = import.meta.env.MODE === 'development' ? 'http://localhost:4000' : 'https://delivery-app-0lcx.onrender.com'


    const [userInfo,setUserInfo] = useState(JSON.parse(sessionStorage.getItem('userInfo')) || false)







    return(
        <loginContext.Provider value={{

            renderORLocalURL,

            userInfo,
            setUserInfo
        
        }}>



        {children}
        </loginContext.Provider>
    )
}




