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
        const target = bistroList.find(bistro=>bistro.username === bistroTarget.username)
        console.log(target.zonas_delivery)
       return target.zonas_delivery
    }

    function createSlug(target){
        return target.replace(/\s+/g, '-').toLowerCase()
    }       




    function bistroHelpDataHandler(bistroData){
        const {_id,username,telefono,imgBistro,rol} = bistroData


        const aux = {
            _id:_id,
            username:username,
            telefono:telefono,
            img:imgBistro
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

    function checkDeliveryZone(bistroData,localidad){
        const {username,imgBistro,zonas_delivery} = bistroData

        const fuse = new Fuse(zonas_delivery,{threshold: 0.3, keys:["zona"]})

        const result = fuse.search(localidad)

        let msg 


        if(result.length === 0){
            msg = "El local no llega a la zona, pero podes comprar y pasar a retirar!"
            Swal.fire({
                title: username,
                text: msg,
                showCancelButton: true,
                confirmButtonText:"Comprar y pasar a retirar",
                cancelButtonText:"Cancelar",
                draggable:true,
                imageUrl: imgBistro || `./victorina-logo.jpg`,
                imageWidth: 400,
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
            checkOwnershipAndContinue,checkDeliveryZone,
            bistroInfo,
            findBistro
           
        }}>



        {children}
        </bistroContext.Provider>
    )
}




