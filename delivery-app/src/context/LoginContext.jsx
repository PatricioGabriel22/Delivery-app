/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react"

const loginContext = createContext()


export const useLoginContext = ()=>{
    const contextHook = useContext(loginContext)
    if (!contextHook){
        throw new Error("Este hook se usa dentro de un provider")
    }
    return contextHook


}






export function LoginProvider({children}){
    return(
        <loginContext.Provider value={{

            



        }}>



        {children}
        </loginContext.Provider>
    )
}




