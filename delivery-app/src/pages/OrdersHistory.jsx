
import { Fragment, useState } from "react";


import ConfirmedOrdersPannel from "../components/ConfirmedOrdersPannel.jsx";
import { verFecha } from "../utils/dateFunctions.js";


export default function OrdersHistory(){

    
    // const {userInfo} = useLoginContext()
    // const {confirmedOrders, isLoading, isError, refresh, setFlagPagination } = useOrdersContext()

    const [fecha,setFecha] = useState(null)
    const [nombre,setNombre] = useState()







    const handleDateChange = (e) => {
        
        const selectedDate = e.target.value; // "2025-04-29"

        if(!selectedDate) return

        const [year, month, day] = selectedDate.split('-');
      
        // Crear fecha como si fuera en zona local (UTC-3) sin desfase
        const date = new Date(year, month - 1, day); // sin zona horaria
      
        setFecha(verFecha(date));
    };


    //muestro las 20 ultimas y son setFlagPagination puedo traerme todas , o tambien podria ir pidiendo mas de a 20 pero calcularme todo el total en el backend

    return(
        <Fragment>
            <div className="flex flex-col">
                <h1 className="w-full text-3xl font-extrabold text-gray-200 text-center">Todos los pedididos</h1>

                <div className="flex flex-col md:flex-row p-3 justify-around ">

                    <label className="flex flex-col  pt-8">
                        Buscar por fecha
                        <input type="date" className="w-[40%] md:w-full  bg-white text-black" 
                            onChange={(e)=>handleDateChange(e)}
                        />
                    </label>


                    <label className="flex flex-col  pt-8">
                        Buscar nombre
                        <input type="text" className="w-[60%] md:w-full  bg-white text-black" 
                            onChange={(e)=>setNombre(e.target.value)}
                        />
                    </label>
{/* 
                    <div className="flex flex-col  mt-8 bg-white rounded w-fit p-2 text-black">
                        <p>Pedidos: {totalPedidos}</p>
                        <p>$900.000.000</p>

                    </div> */}

                </div>


                <ConfirmedOrdersPannel targetDate={fecha} targetName={nombre} />
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