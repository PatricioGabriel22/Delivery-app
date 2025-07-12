/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react"
import ProfileCard from "@components/common/ProfileCard"
import { useShoppingContext } from "@context/ShoppingContext"

import {useNavigate} from 'react-router-dom'


import { RiCashLine } from "react-icons/ri";
import { FaAddressCard } from "react-icons/fa";
import PaymentBTN from "@components/user/PaymentBTN"

export default function SelectPayment(){


    const navigate = useNavigate()

    const {importeTotal} = useShoppingContext()

    const [selectMethod,setSelectMethod] = useState('')

    let paymentMethods = [{
        method:"Efectivo",
        logo: <RiCashLine size={40} className="text-green-400"/>,
        color:" ",
        hoverBG:"hover:bg-green-800 ",
        background:'bg-green-800',
        
    },{
        method:"Transferencia",
        logo: <FaAddressCard size={40} className="text-sky-400"/>,
        color:"",
        hoverBG:"hover:bg-sky-800 ",
        background:'bg-sky-800',
        
    }]

    useEffect(()=>{


        if(importeTotal === 0) {
            navigate('/carrito')
            return
        }

        
    },[])



    return(
        <Fragment>


            <div className=" flex flex-col justify-center mt-15 ">
                <p className="font-bold text-4xl text-center ">Seleccionar metodo de pago</p>
                <span className="w-[85%] md:w-[50%] h-[1px] bg-red-600 m-2 self-center"/>
                <div className="flex flex-col items-center justify-center ">

                    {paymentMethods.map(method => (
                        <span 
                            key={method.method} 
                            className={`${method.color} cursor-pointer font-semibold flex flex-row p-3 gap-2 m-2 justify-center items-center rounded ${method.hoverBG}
                            ${selectMethod === method.method ? method.background : ""}    `}
                            onClick={()=>setSelectMethod(method.method)}
                        >
                            {method.logo}
                            <p>{method.method}</p>
                        </span>
                    ))}


                </div>

            
                <PaymentBTN paymentMethod={selectMethod} importeTotal={importeTotal} />

            </div>
            
          
        </Fragment>
    )
}