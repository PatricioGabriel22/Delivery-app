import { Fragment, useEffect, useState } from "react"
import OrderInfo from "../components/OrderInfo"

import axios from 'axios'
import { useLoginContext } from "../context/LoginContext"



export default function PreOrderManagement(){
    const {renderORLocalURL} = useLoginContext()
    const [allPreOrders, setAllPreOrders] = useState([])
    const [acceptedOrders,setAcceptedOrders] = useState([])
    const [mainArrayFromDB,setMainArrayFromDB] = useState()
    

     

    useEffect(()=>{
        axios.get(`${renderORLocalURL}/getAllPreOrders`,{withCredentials:true}).then((res)=>setMainArrayFromDB(res.data))

    },[renderORLocalURL])

    useEffect(() => {
        if (mainArrayFromDB) {
          
          setAllPreOrders(mainArrayFromDB.filter(data => !data.confirmed))

          setAcceptedOrders(mainArrayFromDB.filter(data => data.confirmed))
        }
      }, [mainArrayFromDB]);

    useEffect(()=>{
        console.log(allPreOrders)
    },[allPreOrders])



    return(
        <Fragment>
            <div className="min-h-screen flex flex-col w-full md:w-2/3 items-center m-auto">
                <h1 className="text-4xl p-4 mb-6 ">Ordenes</h1>
                <div className="flex flex-row justify-around w-full">
                    <div className="flex flex-col w-full p-2">   
                        <h2 className="self-center mb-3 text-3xl">Pre-Ordenes</h2>
                        {allPreOrders.map((preOrder)=>( 
                            <OrderInfo title={"Pre-Ordenes"} 
                            nombreCliente={preOrder.userInfo.username} 
                            formaDeEntrega={preOrder.formaDeEntrega}
                            importe={preOrder.importeTotal}
                            />
                        ))}
                    </div>
                    
                    <div className="flex flex-col w-full p-2">   
                        <h2 className="self-center mb-3 text-3xl">Aceptadas</h2>
                        {acceptedOrders.map((preOrder)=>( 
                            <OrderInfo 
                                nombreCliente={preOrder.userInfo.username} 
                                formaDeEntrega={preOrder.formaDeEntrega}
                                importe={preOrder.importeTotal}
                                />
                        ))}
                    </div>

                </div>
            </div>
        </Fragment>
    )
}