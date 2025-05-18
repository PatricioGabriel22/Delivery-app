
import { Fragment} from "react"
import OrderInfo from "../components/OrderInfo"



import { useSocketContext } from "../context/SocketContext"





export default function PreOrderManagement(){
    const {allPreOrders,acceptedOrders}  = useSocketContext()



    return(
        <Fragment>


            <div className="min-h-screen flex flex-col w-full md:w-2/3 items-center m-auto">
                <h1 className="text-4xl p-4 mb-6 ">Ordenes</h1>
                <div className="flex flex-col md:flex-row justify-around w-full">
                    <div className="flex flex-col w-full p-2">   
                        <h2 className="self-center mb-3 text-3xl">Pre-Ordenes</h2>
                        {allPreOrders?.map((preOrder)=>( 
                            <OrderInfo 
                            title={"Pre-Ordenes"} 
                            preOrderInfo={preOrder}
                            />
                        ))}
                    </div>
                    
                    <div className="flex flex-col w-full p-2">   
                        <h2 className="self-center mb-3 text-3xl">Aceptadas</h2>
                        {acceptedOrders?.filter(item=> !item.delivered).map((acceptedOrder)=>( 
                            <OrderInfo 
                                title={"Aceptadas"} 
                                preOrderInfo={acceptedOrder}
                                />
                        ))}
                    </div>

                </div>
            </div>
        </Fragment>
    )
}