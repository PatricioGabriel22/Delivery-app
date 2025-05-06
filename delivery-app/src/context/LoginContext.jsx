
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
        preview: 'https://delivery-app-stagingapi.onrender.com',
        production: 'https://delivery-app-0lcx.onrender.com',

        LocalStaging:'http://localhost:4000'



    }
    
    const renderORLocalURL = MODE_URLS[import.meta.env.VITE_VERCEL_ENV] || MODE_URLS[import.meta.env.MODE]  // default to production if mode is not recognized


    console.log(renderORLocalURL)


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




