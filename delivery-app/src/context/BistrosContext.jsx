/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState} from "react"
import { useBistroList } from "./SWR"
import { useLoginContext } from "./LoginContext.jsx"

import Fuse from 'fuse.js'
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom"

const bistroContext = createContext()


export const useBistroContext = ()=>{
    const contextHook = useContext(bistroContext)
    if (!contextHook){
        throw new Error("Este hook se usa dentro de un provider")
    }
    return contextHook


}






export function BistroProvider({children}){
    const navigate = useNavigate()

    const {renderORLocalURL} = useLoginContext()

    const [bistroInfo,setBistroInfo] = useState(JSON.parse(localStorage.getItem('bistroInfo')) || false)

    const {openBistros,isLoading,refreshopenBistros} = useBistroList(renderORLocalURL)
    

    
    function findBistro(bistroList,bistroTarget){
        if(!bistroList) return 
        const target = bistroList.find(bistro=>bistro.username === bistroTarget.username)
        
       return target.zonas_delivery
    }

    function createSlug(target){
        if(!target) return
        return target.replace(/\s+/g, '-').toLowerCase()
    }       




    function bistroHelpDataHandler(bistroData){
        const {_id,username,telefono,img,mediosDePago} = bistroData


        const aux = {
            _id:_id,
            username:username,
            telefono:telefono,
            img:img,
            mediosDePago:mediosDePago
        }

        localStorage.setItem('bistroInfo',JSON.stringify(aux))

        setBistroInfo(JSON.parse(localStorage.getItem('bistroInfo')))
    }


    function navigateToBistro(bistroName,navigate){
        //reemplaza espacios, saltos de linea y tabulaciones por "-"
        const target = createSlug(bistroName)

        navigate(`/bistros/${target}`)
    }



    
    function checkOwnershipAndContinue({bistroData,userData,param}){
       

        if(!bistroData) {
            const slug = createSlug(userData.username)
            
            if(userData.rol && param !== slug) return navigate(`/bistros/${slug}`)
            return false
        }

        if(bistroData){

            if(userData.rol && userData.username !== bistroData.username){
                return Swal.fire("Por favor ingresá como usuario para visitar otros bistros")

            }
            return false
            
        }

        return true
    }

    function fuseSearch(key,mainList,target){
        if(!mainList) return
        const fuse = new Fuse(mainList,{threshold: 0.3, keys:[key]})

       return fuse.search(target)
    }

    function checkDeliveryZone(bistroData,localidad){
        const {username,img,zonas_delivery} = bistroData



        const result = fuseSearch('zona',zonas_delivery,localidad)

        let msg 


        if(result.length === 0){
            msg = "El local no llega a la zona, pero podes comprar y pasar a retirar!"
            Swal.fire({
                title: username,
                text: msg,
                showCancelButton: true,
                confirmButtonText:"Comprar y pasar a retirar",
                cancelButtonText:"Cancelar",
                draggable:false,
                imageUrl: img || `./logoApp.png`,
                imageWidth: 250,
                imageHeight: 200,
                imageAlt: "Logo app"
            }).then(result=>{
                const {isConfirmed} = result

                if(isConfirmed){
                    bistroHelpDataHandler(bistroData)
                    navigateToBistro(username,navigate)
                }
            })
            
            return
        }

        bistroHelpDataHandler(bistroData)
        navigateToBistro(username,navigate)
    }







    return(
        <bistroContext.Provider value={{
            openBistros,isLoading,refreshopenBistros,
            navigateToBistro,createSlug,
            checkOwnershipAndContinue,checkDeliveryZone,fuseSearch,
            bistroInfo,
            findBistro
           
        }}>



        {children}
        </bistroContext.Provider>
    )
}




