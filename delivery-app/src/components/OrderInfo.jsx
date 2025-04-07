import { Fragment } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";



export default function OrderInfo({title,nombreCliente,formaDeEntrega,importe}){

    
    return(
        <Fragment>

            <span className="bg-white  h-30  rounded-xl text-black flex flex-col gap-y-2 m-2 mb-10 cursor-pointer">
                <div className="text-lg font-semibold flex flex-row justify-around">
                   <span className="font-normal">{nombreCliente}</span>
                   <span className="font-normal">${importe}</span>
                </div>

                <div className="text-center text-sm text-gray- font-semibold">
                    {formaDeEntrega}
                </div>

                <span className="flex flex-row justify-center gap-x-10 items-center bg-gray-700 h-full rounded-b-lg">
                    {title === "Pre-Ordenes" ? (
                        <Fragment>
                            <MdOutlineCancel size={40} className="text-red-700 hover:text-red-500"/>
                            <GiConfirmed size={40} className="text-green-700 hover:text-green-500"/>
                        </Fragment>
                    ): (
                        <button className="bg-sky-100 hover:bg-sky-500 rounded-full p-2">Orden Lista</button>
                    )}

                </span>

            </span>
               
        </Fragment>
    )
}