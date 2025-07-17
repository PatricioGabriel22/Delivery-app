/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react"
import { useShoppingContext } from "@context/ShoppingContext"

import {useNavigate} from 'react-router-dom'


import { RiCashLine } from "react-icons/ri";
import { FaAddressCard } from "react-icons/fa";
import PaymentBTN from "@components/user/PaymentBTN"
import { useBistroContext } from "../../context/BistrosContext";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function SelectPayment(){

    const navigate = useNavigate()

    const {importeTotal} = useShoppingContext()

    const [paymentMethods,setPaymentMethods] = useState(JSON.parse(localStorage.getItem('paymentMethods')) || [])

    const [selectMethod,setSelectMethod] = useState('')



    const [verPagosOnline, setVerPagosOnline] = useState(false)

    const copiarAlPortapapeles = async (metodoElegido,alias) => {
        try {
            await navigator.clipboard.writeText(alias);
            toast.success(`Copiaste el alias de ${metodoElegido}`)
        } catch (err) {
        console.error("Error al copiar", err)
        }
    }

    useEffect(()=>{

        console.log(paymentMethods)

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


                    {paymentMethods.map((method, index) => {
                        if (method.medio === 'Efectivo') {
                            return (
                            <span
                                key={index}
                                className="w-full md:w-90 cursor-pointer font-semibold flex flex-row p-3 gap-2 m-2 justify-center items-center rounded 'bg-green-800' hover:bg-green-800"
                                onClick={() => setSelectMethod(method.medio)}
                            >
                                <RiCashLine size={40} className="text-green-400"/>
                                <p>{method.medio}</p>


                            </span>
                            )
                        }


                        return(
                            <div className="flex flex-col w-full md:w-90">
                                <div className="cursor-pointer flex flex-row justify-center items-center p-3 gap-2 m-2 'bg-sky-800' hover:bg-sky-800 rounded">
                                    <FaAddressCard size={40} className="text-sky-400"/>
                                    <p onClick={()=>setVerPagosOnline(!verPagosOnline)} >Ver medios de pago online</p>

                                </div>
                                {verPagosOnline && (

                                    <span
                                        key={index}
                                        className="cursor-pointer font-semibold flex flex-row p-3 gap-2 m-2 justify-center items-center rounded border-2 border-sky-900 bg-sky-300 text-black"
                                        onClick={() => setSelectMethod(method.medio)}>   
                                        <div className="flex flex-col text-center w-full gap-y-5 ">

                                            <p className="text-xl">{method.medio}</p>
                                            
                                            <p className="flex flex-row items-center justify-center gap-x-2" onClick={()=>copiarAlPortapapeles(method.medio,method.alias,index)} >Alias: {method.alias} <Copy size={16}/> </p>
                                            
                                            <p>A nombre de: funalno</p>

                                        

                                        </div>
                                    </span>
                                )}

                            </div>
                        )
                        
                        
                    })}


                </div>

            
                <PaymentBTN paymentMethod={selectMethod} importeTotal={importeTotal} />

            </div>
            
          
        </Fragment>
    )
}