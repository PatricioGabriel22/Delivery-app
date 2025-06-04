import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBistroList } from "@context/SWR";
import { useLoginContext } from "@context/LoginContext";

import Loading from '@components/common/Loading.jsx'

import {ccapitalizer_3000} from '../../utils/capitalize.js'

import Fuse from 'fuse.js'
import Swal from 'sweetalert2'
import { navigateToBistro } from "../../utils/envioFunctions.js";


export default function Bistros(){

    const {renderORLocalURL,userInfo} = useLoginContext()
    const {openBistros,isLoading} = useBistroList(renderORLocalURL)

    const navigate = useNavigate()
    const [showDelivery,setShowDelivery] = useState(false)
    // useEffect(()=>{console.log(openBistros)},[openBistros])



    function checkDeliveryZone(bistroData){
        console.log(bistroData)
        const {username,imgBistro,zonas_delivery} = bistroData

        const fuse = new Fuse(zonas_delivery,{threshold: 0.3, keys:["zona"]})

        const result = fuse.search(userInfo.localidad)

        let msg 


        if(result.length === 0){
            msg = "El local no llega a la zona, pero podes comprar y pasar a retirar!"
            Swal.fire({
                title: username,
                text: msg,
                showCancelButton: true,
                confirmButtonText:"Seguir con mi compra",
                cancelButtonText:"Cancelar",
                draggable:true,
                imageUrl: imgBistro || `./victorina-logo.jpg`,
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: "Logo app"
            }).then(result=>{
                const {isConfirmed} = result
    
                if(isConfirmed) navigateToBistro(username,navigate)
            })
            
            return
        }

        navigateToBistro(username,navigate)
    }

    return(
        <Fragment>
            <div className="flex flex-col w-full items-center ">

                {isLoading ?  (
                    <Loading msg={"Cargando locales abiertos"} />
                ):(
                    <div className="flex flex-col p-3 m-5 w-full text-center">
                        <h1 className="text-4xl pb-1 ">Locales disponibles</h1>
                        <span className="h-[1px]  bg-red-600"/>
                        <p className="p-2">Tu compra puede ser con delivery o con retiro en el local!</p>
                    </div>
                )}


                {openBistros?.map((bistro,index)=>(
                    <div className="flex p-2 w-[98%] md:w-120 justify-between bg-white text-b rounded items-center cursor-pointer border-3 border-red-600" key={index}
                        >

                        <div className="flex flex-col text-black  ">
                            <p className="font-bold mb-2 text-lg">{ccapitalizer_3000(bistro.username)}</p>

                            <div className="flex flex-row">

                            </div>
                            <p className="font-semibold">📞{bistro.telefono}</p>
                            <p className="font-semibold">📍{ccapitalizer_3000(bistro.localidad)}</p>
                        

                            <span className="pt-3" onClick={()=>setShowDelivery(!showDelivery)}>🧭Ver zonas de delivery</span>

                            <div className={`h-20 ${showDelivery ? "block":"hidden"} overflow-y-hidden `}>

                                {showDelivery && bistro.zonas_delivery.map((zona,index)=>(
                                    <p className="text-black" key={index}>-{ccapitalizer_3000(zona.zona)}</p>
                                ))}

                            </div>

                        </div>
                                {/* navigateToBistro(bistro.username) */}
                        <div className="flex flex-col self-start " onClick={()=>checkDeliveryZone(bistro)}>
                            <img loading="lazy" src={bistro.imgBistro || `./victorina-logo.jpg`} width={190} className="rounded  "  />
                            <span className="text-black text-center cursor-pointer font-bold text-lg" >Comprar!</span>
                        </div>
                    </div>
                ))}
            </div>
        </Fragment>
    )
}