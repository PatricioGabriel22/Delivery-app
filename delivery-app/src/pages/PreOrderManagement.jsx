/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react"
import OrderInfo from "../components/OrderInfo"


import { useLoginContext } from "../context/LoginContext"
import { useShoppingContext } from "../context/ShoppingContext"



export default function PreOrderManagement(){
    const {socket} = useShoppingContext()
    const {allOrdersFromUser} = useLoginContext()
    const [allPreOrders, setAllPreOrders] = useState([])
    const [acceptedOrders,setAcceptedOrders] = useState([])
    // const [mainArrayFromDB,setMainArrayFromDB] = useState()
    

    
    const esDeHoy = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha >= inicioDelDia && fecha < finDelDia;
    };
    const hoy = new Date();
    const inicioDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);




    // useEffect(()=>{
    //     axios.get(`${renderORLocalURL}/getAllPreOrders`,{withCredentials:true}).then((res)=>{
    //         setMainArrayFromDB(res.data)
    //         setAllOrdersFromUser(res.data.filter(data=> data.userInfo.id === userInfo.id))
    //     })

    // },[renderORLocalURL])

    useEffect(() => {

        if (allOrdersFromUser) {
            setAllPreOrders(allOrdersFromUser.filter(data => !data.confirmed && esDeHoy(data.createdAt)))
            setAcceptedOrders(allOrdersFromUser.filter(data => data.confirmed && esDeHoy(data.createdAt)))
            
              
        }


    }, [allOrdersFromUser]);



    useEffect(() => {
        socket.on('checkedPreOrder', (data) => {
          console.log(data);
      
          if (data.status) {

            //aca saco del array de pre ordenes aquella cuyo id se aceptó y ya no la quiero ver en preordenes
            setAllPreOrders(prev => prev.filter(item=> item._id !== data.id))

            setAcceptedOrders(prev => {
                //me aseguro que no me repita la orden por si acaso
                const targetSinDuplicar = prev.filter(item=>item._id !== data.id)

                if(esDeHoy(data.confirmedOrder.createdAt)){

                    return [...targetSinDuplicar,data.confirmedOrder]
                }

            })

          }
        });


        socket.on('nuevaPreOrdenRecibida',(data)=>{
            setAllPreOrders(prev=>[...prev,data.nuevaPreOrden])
        })

        socket.on('finishedOrder',(data)=>{
            console.log(data)
            setAcceptedOrders(prev=>prev.map(item=>{

                if(item._id === data.finishedOrder._id){
                    return {...item, finished: data.finishedOrder.finished}
                }else{
                    return item
                }
            }))
        })

        socket.on('deliveredOrder',(data)=>{
            console.log(data)
            setAcceptedOrders(prev=>prev.filter(item=> item._id !== data.deliveredOrder._id))
        })

      
        return () => {
          socket.off('checkedPreOrder')
          socket.off('nuevaPreOrdenRecibida')
          socket.off('finishedOrder')
          socket.off('deliveredOrder')

        };
    }, []);

    console.log(acceptedOrders)


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