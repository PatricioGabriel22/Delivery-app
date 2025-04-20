/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react"
import OrderInfo from "../components/OrderInfo"


import { useLoginContext } from "../context/LoginContext"

import { esDeHoy } from "../utils/dateFunctions"
import { useSocketContext } from "../context/SocketContext"




export default function PreOrderManagement(){

    const {allOrdersFromAdmin} = useLoginContext()
    const {allPreOrders,setAllPreOrders,acceptedOrders,setAcceptedOrders}  = useSocketContext()
 
    // const [mainArrayFromDB,setMainArrayFromDB] = useState()
    

    




    // useEffect(()=>{
    //     axios.get(`${renderORLocalURL}/getAllPreOrders`,{withCredentials:true}).then((res)=>{
    //         setMainArrayFromDB(res.data)
    //         setallOrdersFromAdmin(res.data.filter(data=> data.userInfo.id === userInfo.id))
    //     })

    // },[renderORLocalURL])

    useEffect(() => {
    
        if (allOrdersFromAdmin) {
            setAllPreOrders(allOrdersFromAdmin.filter(data => !data.confirmed && esDeHoy(data.createdAt)))
            setAcceptedOrders(allOrdersFromAdmin.filter(data => data.confirmed && esDeHoy(data.createdAt)))
            
              
        }


    }, [allOrdersFromAdmin]);




    return(
        <Fragment>


            <div className="min-h-screen flex flex-col w-full md:w-2/3 items-center m-auto">
                <h1 className="text-4xl p-4 mb-6 ">Ordenes</h1>
                <div className="flex flex-col md:flex-row justify-around w-full">
                    <div className="flex flex-col w-full p-2">   
                        <h2 className="self-center mb-3 text-3xl">Pre-Ordenes</h2>
                        {allPreOrders.map((preOrder)=>( 
                            <OrderInfo 
                            title={"Pre-Ordenes"} 
                            preOrderInfo={preOrder}
                            nombreCliente={preOrder.userInfo.username} 
                            formaDeEntrega={preOrder.formaDeEntrega}
                            importe={preOrder.importeTotal}
                            confirmado={preOrder.confirmed}
                            />
                        ))}
                    </div>
                    
                    <div className="flex flex-col w-full p-2">   
                        <h2 className="self-center mb-3 text-3xl">Aceptadas</h2>
                        {acceptedOrders.filter(item=> !item.delivered).map((acceptedOrder)=>( 
                            <OrderInfo 
                                title={"Aceptadas"} 
                                preOrderInfo={acceptedOrder}
                                nombreCliente={acceptedOrder.userInfo.username} 
                                formaDeEntrega={acceptedOrder.formaDeEntrega}
                                importe={acceptedOrder.importeTotal}
                                preparado={acceptedOrder.finished}
                                entregado={acceptedOrder.delivered}


                                />
                        ))}
                    </div>

                </div>
            </div>
        </Fragment>
    )
}