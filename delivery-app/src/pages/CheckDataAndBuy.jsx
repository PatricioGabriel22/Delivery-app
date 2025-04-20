import { Fragment, useEffect } from "react"
import ProfileCard from "../components/ProfileCard"
import { useLoginContext } from "../context/LoginContext"
import { useShoppingContext } from "../context/ShoppingContext"

import {useNavigate} from 'react-router-dom'


import { RiCashLine } from "react-icons/ri";
import { SiMercadopago } from "react-icons/si";

export default function CheckDataAndBuy(){


    const navigate = useNavigate()


    const {userInfo} = useLoginContext()
    const {importeTotal} = useShoppingContext()

    const paymentMethods = [{
        method:"Efectivo",
        logo: <RiCashLine size={40} className="text-green-400"/>,
        color:" ",
        hoverBG:"hover:bg-green-900 ",
        selected:false
    },{
        method:"Mercado Pago (incluye tarjetas)",
        logo: <SiMercadopago size={40} className="text-sky-400"/>,
        color:"",
        hoverBG:"hover:bg-sky-900 ",
        selected:false
    }]

    useEffect(()=>{
        if(importeTotal === 0) navigate('/carrito')
    },[importeTotal,navigate])



    return(
        <Fragment>
            <div>
                <p className="text-center p-5 font-semibold text-xl">Revise que sus datos sean correctos</p>
                <ProfileCard userInfo={userInfo} />

                <div className="p-3 flex flex-col">

                    <div className="flex flex-col  items-center justify-center">

                    {paymentMethods.map(method => (
                        <span 
                            key={method.method} 
                            className={`${method.color} flex flex-row p-3 gap-2 justify-center items-center rounded ${method.hoverBG}`}
                        >
                            {method.logo}
                            <p>{method.method}</p>
                        </span>
                    ))}



                    </div>

                    <span className="text-lg p-5 self-center ">Importe a pagar: ${importeTotal} </span>

                    <button className="bg-red-600 rounded-full self-center w-full md:w-[40%] p-5  text-xl cursor-pointer hover:bg-red-700">Pagar</button>

                </div>
            </div>
        </Fragment>
    )
}