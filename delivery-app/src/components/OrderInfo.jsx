import { Fragment, useRef } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { CiRead } from "react-icons/ci";

import { useLoginContext } from "../context/LoginContext";
import { useShoppingContext } from "../context/ShoppingContext";




export default function OrderInfo({title,preOrderInfo,nombreCliente,formaDeEntrega,importe,confirmado,preparado,entregado}){

    const {renderORLocalURL} = useLoginContext()

   const { acceptPreOrder, cancelPreOrder, ordenPreparada, ordenEntregada} = useShoppingContext()

    const dialogRef = useRef(null);

    const abrirModal = () => {
    dialogRef.current.showModal(); // Abre el modal
    };

    const cerrarModal = () => {
    dialogRef.current.close(); // Cierra el modal
    };
    


    return(
        <Fragment>

            <span className="bg-white  h-38 rounded-xl text-black flex flex-col gap-y-2 m-2  mb-10 cursor-pointer">
                <div className="text-xl  flex flex-row justify-around">
                   <span className="font-bold">{nombreCliente}</span>
                   <span className="font-bold">${importe}</span>
                </div>

                <div className="text-center text-xl text-gray- font-bold">
                    {formaDeEntrega}
                </div>



                <span className={`flex flex-row justify-center gap-x-10 items-center h-full rounded-b-lg 
                        ${formaDeEntrega === 'Envio' ? "bg-red-500" : "bg-sky-500"} `}>

                    <div className="flex flex-col  w-full">
                        <p 
                            className="text-xl font-semibold rounded-lg hover:bg-gray-300 p-2 self-center text-center w-fit"
                            onClick={()=>abrirModal()}
                            >Ver pre-orden
                        </p>

                        {title === "Aceptadas" ? 
                            (   
                            <div className="flex flex-row justify-around w-full cursor-pointer">                           
                                <button 
                                    className={` hover:bg-sky-500 rounded-lg p-2 ${preparado? "bg-green-500":"bg-sky-100"} `}
                                    onClick={()=>ordenPreparada(renderORLocalURL,preOrderInfo)}
                                    >Preparada</button>

                                <button 
                                    className={`bg-sky-100 hover:bg-green-500 rounded-lg p-2 ${entregado? "bg-green-500":""} `}
                                    onClick={()=>ordenEntregada(renderORLocalURL,preOrderInfo)}
                                    >Entregada</button>

                            </div>
                            ) : 
                        ""}

                    </div>      

                    <dialog ref={dialogRef} className="rounded-xl p-6 shadow-xl w-full md:w-[45%] h-[90%] justify-self-center self-center backdrop:bg-black/50">
                        <div className="flex justify-between items-start">
                            <img src="/vite.png" className="h-24"/>
                            <span onClick={()=>cerrarModal()} className=" bg-red-700 p-3 text-white rounded-lg">X</span>
                        </div>

                        <div className="flex flex-col text-lg ">
                            <p className="font-bold">Nombre: {nombreCliente}</p>
                            <p className="font-bold">Telefono: {preOrderInfo.userInfo.telefono}</p>
                            <p className="font-bold">Direccion: {preOrderInfo.userInfo.direccion}</p>
                            <p className="font-bold">Entrecalles/Esquina: {preOrderInfo.userInfo.entreCalles}</p>
                            <span className="h-[1px] w-full bg-red-700 mt-9" />
                            <p className="font-bold ">Pedido:</p>

                            

                            {preOrderInfo.preOrder.map(item=>(
                                <div className={`flex flex-row w-full p-2 items-center text-xl   `}>
                                        <p className="w-1/3">{item.cantidad}x{item.nombre}</p>
                                        <p className="w-2/3 text-end">${item.precio}</p>
                                </div>

                            
                            ))}
                            
                            
                            <div 
                                className={`flex flex-row justify-end gap-x-14 w-full text-xl text-end rounded
                                    ${formaDeEntrega === 'Envio' ? "bg-red-500" : "bg-sky-500"} } `}>
                                <p className="font-bold">{formaDeEntrega}</p>
                                <p className="font-bold ">${importe}</p>
                            </div>

                        </div>

                        <div className="flex flex-row justify-around bg-gray-600  rounded-full w-full mt-2">
                            {title === "Pre-Ordenes" ? (
                                <Fragment>
                                    <MdOutlineCancel 
                                        size={80} 
                                        className={`text-red-700 hover:text-red-500  `}
                                        onClick={()=>cancelPreOrder(renderORLocalURL,preOrderInfo)}
                                    />
                                    <GiConfirmed 
                                        size={80} 
                                        className={`text-green-700 hover:text-green-500 ${confirmado ? "invisible":""} `}
                                        onClick={()=>acceptPreOrder(renderORLocalURL,preOrderInfo)}
                                        />
                                </Fragment>
                            ): ("")}


                        </div>    
                    </dialog>


                </span>

            </span>
               
        </Fragment>
    )
}