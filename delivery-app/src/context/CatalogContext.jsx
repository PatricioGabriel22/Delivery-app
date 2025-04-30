
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext} from "react"
import { useCatalogMaker } from "./SWR"
import { useLoginContext } from "./LoginContext"

const catalogoContext = createContext()


export const useCatalogContext = ()=>{
    const contextHook = useContext(catalogoContext)
    if (!contextHook){
        throw new Error("Este hook se usa dentro de un provider")
    }
    return contextHook


}






export function CatalogoProvider({children}){

    const {renderORLocalURL} = useLoginContext()
    
    
    const {catalogoDelAdmin,refresh,isLoading,isError} = useCatalogMaker(renderORLocalURL)
    

  

    return(
        <catalogoContext.Provider value={{

            catalogoDelAdmin,
            refresh,
            isLoading,
            isError
        
        }}>



        {children}
        </catalogoContext.Provider>
    )
}




