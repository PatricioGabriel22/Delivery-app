
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
    

    const [userInfo,setUserInfo] = useState(JSON.parse(sessionStorage.getItem('userInfo')) || false)


    const MODE_URLS = {
        development: 'http://localhost:4000',
        production: 'https://delivery-app-0lcx.onrender.com',
        staging: 'https://delivery-app-stagingapi.onrender.com',
    }
    
    const renderORLocalURL = MODE_URLS[import.meta.env.MODE] || MODE_URLS.production  // default to production if mode is not recognized





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




