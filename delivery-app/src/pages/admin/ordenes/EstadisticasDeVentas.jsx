/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLoginContext } from "@context/LoginContext";
import { useSocketContext } from "@context/SocketContext";

import { useCalcularEstadisticasDeVentas } from "@context/SWR";






export default function EstadisticasDeVentas(){

    const {userInfo,renderORLocalURL} = useLoginContext()
    const {socket} = useSocketContext()


    const [fecha,setFecha] = useState({
        desde:"",
        hasta:""
    })

    const {importeDelRango, isLoading,error,refreshSearching} = useCalcularEstadisticasDeVentas(fecha.desde,fecha.hasta,userInfo,renderORLocalURL)
    
        



    const handleDateChange = (e) => {
        
        const selectedDate = e.target.value; // "2025-04-29"

        if(!selectedDate) return

        const [year, month, day] = selectedDate.split('-');
        
        // Crear fecha como si fuera en zona local (UTC-3) sin desfase
        const date = new Date(year, month - 1, day); // sin zona horaria
        
        setFecha(prev=>({
            ...prev,
            [e.target.name]: date.toDateString()
        }));
    };

    useEffect(()=>{(console.log(importeDelRango))},[importeDelRango,fecha])

    return(
        <div className="flex flex-col justify-center  pt-10 gap-y-20">
            <div className="flex w-full justify-around">
                <label className="flex flex-col text-center">Desde
                    <input type="date" className="border-2 rounded p-2 text-center bg-white text-black" onChange={(e)=>handleDateChange(e)} name="desde" />
                </label>

                <label className="flex flex-col text-center">Hasta
                    <input type="date" className="border-2 rounded p-2 text-center bg-white text-black" onChange={(e)=>handleDateChange(e)} name="hasta"/>
                </label>

            </div>

            {importeDelRango && (<div className="self-center p-4 m-4 border-2 bg-red-600 rounded">
                <p>Importe vendido en el periodo consultado</p>
                <p className="text-2xl text-center">${importeDelRango}</p>
            </div>)}

        </div>
    )
}