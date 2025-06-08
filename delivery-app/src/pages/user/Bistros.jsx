import { Fragment, useState } from "react";

import { useLoginContext } from "@context/LoginContext";

import Loading from '@components/common/Loading.jsx'
import Nav from '@components/common/Nav.jsx'


import {ccapitalizer_3000} from '../../utils/capitalize.js'
import { useBistroContext } from "../../context/BistrosContext.jsx";


export default function Bistros(){

    const {userInfo} = useLoginContext()
    const {checkDeliveryZone,checkOwnershipAndContinue,openBistros,isLoading} = useBistroContext()

    const [showDelivery,setShowDelivery] = useState(false)
    const [indexDelivery,setIndexDelivery] = useState(null)



    function verDeliveryZonas(flag,index){
        setShowDelivery(!flag)
        setIndexDelivery(index)
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
                    <div className="flex p-2 m-5 w-[98%] md:w-120 justify-between bg-white text-b rounded items-center cursor-pointer border-3 border-red-600" key={index}
                        >

                        <div className="flex flex-col text-black  ">
                            <p className="font-bold mb-2 text-lg">{ccapitalizer_3000(bistro.username)}</p>

                            <div className="flex flex-row">

                            </div>
                            <p className="font-semibold">📞{bistro.telefono}</p>
                            <p className="font-semibold">📍{ccapitalizer_3000(bistro.localidad)}</p>
                        

                            <span className="pt-3" onClick={()=>verDeliveryZonas(showDelivery,index)}>🧭Ver zonas de delivery</span>

                            <div className={`h-20 ${showDelivery && indexDelivery === index ? "block":"hidden"} overflow-y-hidden `}>

                                {showDelivery && bistro.zonas_delivery.map((zona,index)=>(
                                    <p className="text-black" key={index}>-{ccapitalizer_3000(zona.zona)}</p>
                                ))}

                            </div>

                        </div>
                                {/* Debo chequear que no sea otro local y que si la zona de delivery llega al usuario) */}
                        <div className="flex flex-col self-start " 
                            onClick={()=>{
                                checkOwnershipAndContinue({bistroData:bistro,userData:userInfo})
                                checkDeliveryZone(bistro,userInfo.localidad)
                            }}>
                            <img loading="lazy" src={bistro.imgBistro || `./victorina-logo.jpg`} width={190} className="rounded  "  />
                            <span className="text-black text-center cursor-pointer font-bold text-lg" >Comprar!</span>
                        </div>
                    </div>
                ))}

               <Nav/> 
            </div>
        </Fragment>
    )
}