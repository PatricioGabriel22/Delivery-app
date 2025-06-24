import { Fragment, useEffect, useState } from "react";

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
    
    useEffect(()=>{console.log(openBistros)},[openBistros])

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
                    <div className="p-2 m-5 w-[98%] md:w-120  bg-white text-b rounded cursor-pointer border-3 border-red-600" key={index}>

                        <div className="flex flex-col justify-between text-black "
                            onClick={()=>{
                                    checkOwnershipAndContinue({bistroData:bistro,userData:userInfo})
                                
                                    checkDeliveryZone(bistro,userInfo.localidad)
                            }}>

                            <div className="flex flex-row justify-between ">
                                <div className="flex flex-col">
                                    <p className="font-bold mb-2 text-2xl text-center">{ccapitalizer_3000(bistro.username)}</p>
                                    <p className="font-semibold">📞{bistro.telefono}</p>
                                    <p className="font-semibold">📍{ccapitalizer_3000(bistro.direccion)}</p>
                                    <p className="font-semibold">🏘️{ccapitalizer_3000(bistro.localidad)}</p>
                                </div>
                                <div className="flex flex-col items-center  ">
                                    <img loading="lazy" src={bistro.img || `./logoApp.png`} width={200} className="rounded mt-5 h-40 object-fill self-end "  />
                                </div>
                            </div>
                        

                        </div>
                        <p className="mt-5 text-black" onClick={()=>verDeliveryZonas(showDelivery,index)}>🧭Ver zonas de delivery</p>
                    
                        <div className={`h-20 ${showDelivery && indexDelivery === index ? "block":"hidden"} overflow-x-hidden `}>

                            {showDelivery && bistro.zonas_delivery.map((zona,index)=>(
                                <p className="text-black" key={index}>-{ccapitalizer_3000(zona.zona)}</p>
                            ))}

                        </div>
       
                    </div>
                ))}

            </div>
        </Fragment>
    )
}