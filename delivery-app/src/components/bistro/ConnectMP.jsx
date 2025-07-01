import { useParams } from "react-router-dom"
import { useLoginContext } from "../../context/LoginContext"
import { useState,useEffect, Fragment } from "react"
import toast from "react-hot-toast"

import { SiMercadopago } from "react-icons/si";
import { FaSpinner } from "react-icons/fa6";




export default function ConnectMP(){

    const {bistroName} = useParams()
    const {userInfo,renderORLocalURL} = useLoginContext()

    const [flagConnected, setFlagConnected] = useState(false)
    const [loading, setLoading] = useState(false)


    const stateEncoded = encodeURIComponent(`${userInfo._id}|${bistroName}`)
    const mpAuthURL = `https://auth.mercadopago.com.ar/authorization?response_type=code&client_id=7826358251393259&redirect_uri=${renderORLocalURL}/oauth/callback&state=${stateEncoded}`


    
    useEffect(()=>{
        //https://delivery-app-git-staging-patriciogabriel22-pr.vercel.app/bistros/victorina?status=succes&bistro=6806b8fe2b72a9697aa59e5f
        const params = new URLSearchParams(window.location.search);
        console.log(params.get('status')); // "approved"

        if(params.get('status') === "approved") {
            setFlagConnected(true)
            setLoading(false)
            toast.success('Ya estas listo para cobrar con MercadoPago')
            return
        }

        if(params.get('status') === "error"){
            setLoading(false)

            toast.error('Algo salió mal con tu conexion a Mercado Pago')
            return
        }

        setLoading(false)

        
    },[])




    return(
        <Fragment>

        {!userInfo.tokenMercadoPago && !flagConnected && (
            <div className="flex flex-row rounded items-center bg-sky-600 p-2 border-2  ">
                {loading ? (
                    <div className="flex flex-row items-center gap-x-2">

                        <FaSpinner className="animate-spin" />
                        <p>Conectando a Mercado Pago</p>
                    </div>
                    
                ):(
                   <div className="flex flex-row items-center gap-x-2" onClick={()=>setLoading(true)}>
                        <SiMercadopago size={32} className="text-white"/>
                        <a href={mpAuthURL}>Conectar a Mercado Pago</a>
                   </div> 
                )}
    
            </div>
            
        )}


        </Fragment>
    )
}