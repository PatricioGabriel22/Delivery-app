
import { Fragment, useState } from "react";


import ConfirmedOrdersPannel from "@components/common/ConfirmedOrdersPannel.jsx";

import { Link } from "react-router-dom";


export default function OrdersHistory(){

    
    // const {userInfo} = useLoginContext()
    // const {confirmedOrders, isLoading, isError, refresh, setFlagPagination } = useOrdersContext()

   
    const [nombre,setNombre] = useState()








    //muestro las 20 ultimas y son setFlagPagination puedo traerme todas , o tambien podria ir pidiendo mas de a 20 pero calcularme todo el total en el backend

    return(
        <Fragment>
            <div className="flex flex-col">
                <h1 className="w-full text-3xl font-extrabold text-gray-200 text-center">Todos los pedididos</h1>

                <div className="flex flex-col md:flex-row  justify-around gap-5 ">

                    <label className="flex flex-col  pt-8 text-center">
                        Buscar nombre
                        <input type="text" className=" self-center text-center w-40 md:w-full  bg-white text-black" 
                            onChange={(e)=>setNombre(e.target.value)}
                        />
                    </label>


                    <button className="rounded-full p-1 border-1 hover:bg-red-600 cursor-pointer w-40 self-center ">
                        <Link to={"/estadisticas"}>
                            Estadisticas de mis ventas
                        </Link>
                    </button>

                </div>


                <ConfirmedOrdersPannel  targetName={nombre} />
            </div>
            
        </Fragment>
    )

}



// const resumen = await Order.aggregate([
//     {
//         $match: { 
//             user: id, //si quisiera filtrar por el local al que se le compró
//             status: "confirmed" 
//         }
//     },
//     {
//         $group: {
//             _id: null,
//             totalVentas: { $sum: 1 }, // cuenta cantidad de órdenes
//             totalPesos: { $sum: "$totalPrice" } // suma el campo totalPrice (o el que uses para precio total de orden)
//         }
//     }
// ]);