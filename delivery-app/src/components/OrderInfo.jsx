import { Fragment, useRef, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";


import { useLoginContext } from "../context/LoginContext";
import { useShoppingContext } from "../context/ShoppingContext";
import { decidirCostoEnvio } from "../utils/envioFunctions";
import BannerCloseLogo from "./BannerCloseLogo";





export default function OrderInfo({title,preOrderInfo}){

    const {formaDeEntrega,importeTotal,confirmed,finished,delivered,paymentMethod,_id} = preOrderInfo
    const {username} = preOrderInfo.userInfo



    const {renderORLocalURL} = useLoginContext()

    const {orderStatusHandler} = useShoppingContext()

    const [flagMsgSugerencias,setFlagMsgSugerencias] = useState(false)

 

    const dialogRef = useRef(null);

    const abrirModal = () => {
    dialogRef.current.showModal(); // Abre el modal
    };

    const cerrarModal = () => {
    dialogRef.current.close(); // Cierra el modal
    };
    

    function handleSugerencias(e){
        e.preventDefault()
        
        const msgDeSugerencia = e.target[0].value
        console.log(msgDeSugerencia)

        orderStatusHandler(renderORLocalURL,preOrderInfo,"cancelada",msgDeSugerencia)
        cerrarModal()
    }






    return(
        <Fragment>

            <span className="bg-white  h-38 rounded-xl text-black flex flex-col gap-y-2 m-2  mb-10 cursor-pointer">
                <div className="text-xl  flex flex-row justify-around">
                   <span className="font-bold">{username}</span>
                   <span className="font-bold">${importeTotal}</span>
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
                            <div className="flex flex-row justify-around w-full ">                           
                                <button 
                                    className={`cursor-pointer hover:bg-sky-500 rounded-lg p-2 ${finished? "bg-green-500":"bg-sky-100"} `}
                                    onClick={()=>orderStatusHandler(renderORLocalURL,preOrderInfo,"preparada")}
                                    >Preparada</button>

                                <button 
                                    className={`cursor-pointer bg-sky-100 hover:bg-green-500 rounded-lg p-2 ${delivered? "bg-green-500":""} `}
                                    onClick={()=>orderStatusHandler(renderORLocalURL,preOrderInfo,"entregada")}
                                    >Entregada</button>

                            </div>
                            ) : 
                        ""}

                    </div>      

                    <dialog ref={dialogRef} className="rounded-xl p-6 shadow-xl w-full md:w-[45%] h-[90%] justify-self-center self-center backdrop:bg-black/50">
                            <BannerCloseLogo close={cerrarModal} />

                        <div className="flex flex-col text-lg ">
                            <p className="font-bold">Nombre: {username}</p>
                            <p className="font-bold">Telefono: {preOrderInfo.userInfo.telefono}</p>
                            <p className="font-bold">Direccion: {preOrderInfo.userInfo.direccion}</p>
                            <p className="font-bold">Entrecalles/Esquina: {preOrderInfo.userInfo.entreCalles}</p>
                            <span className="h-[1px] w-full bg-red-700 mt-9" />
                            <p className="font-bold ">Pedido:</p>

                            

                            <div className="flex flex-col">
                                {preOrderInfo.preOrder.map(item=>(

                                    <div className={`flex flex-row justify-between w-full p-2 items-center text-xl   `}>
                                        <p>{item.cantidad}x {item.nombre}</p>
                                        <p>${item.precio}</p>

                                    </div>
                                            
                                            
                                ))}

                                    <span className="flex flex-row self-end p-2">
                                    {preOrderInfo.formaDeEntrega === "Envio"
                                        ? `Envio: $${decidirCostoEnvio(preOrderInfo.formaDeEntrega, preOrderInfo.userInfo.localidad)}`
                                        : ""}
                                    </span>
                            </div>
                            
                            
                            <div 
                                className={`flex flex-row justify-between  w-full text-xl text-end rounded p-2
                                    ${formaDeEntrega === 'Envio' ? "bg-red-500" : "bg-sky-500"} } `}>
                                <p className="font-bold">{formaDeEntrega}</p>
                                <p className="font-bold ">Total: ${importeTotal}</p>
                            </div>

                            {paymentMethod && (
                                <span className="font-semibold text-center p-5">Metodo de pago: {paymentMethod}</span>
                            )}



                        </div>

                        <div className="flex flex-row justify-around bg-gray-600  rounded-full w-full mt-2">
                            {title === "Pre-Ordenes" ? (
                                <Fragment>
                                    <MdOutlineCancel 
                                        size={80} 
                                        className={`text-red-700 hover:text-red-500 ${flagMsgSugerencias ? "text-center":""} `}
                                        onClick={()=>{
                                            
                                            setFlagMsgSugerencias(!flagMsgSugerencias)
                                        }}
                                    />
                                    <GiConfirmed 
                                        size={80} 
                                        className={`text-green-700 hover:text-green-500 ${confirmed || flagMsgSugerencias? "hidden":""} `}
                                        onClick={()=>{
                                            orderStatusHandler(renderORLocalURL,preOrderInfo,"aceptada")
                                            cerrarModal()
                                        }}
                                    />


                                </Fragment>
                            ): ("")}


                        </div> 

                        {flagMsgSugerencias && (
                            <Fragment>

                                <form onSubmit={handleSugerencias} >
                                    <textarea 
                                        className="border-1 w-full h-24 bg-white  mt-3 rounded p-1"
                                        placeholder="Sugerir productos al cliente"    
                                    />
                                    <button 
                                        type="submit" 
                                        className=" rounded-full bg-red-500 w-full p-2 font-bold text-xl border-2 border-black hover:cursor-pointer"
                                        
                                    >Enviar sugerencias</button>
                                    
                                </form>
                                
                                <div className="flex flex-row w-full justify-center items-center mt-5 ">
                                    <span className="w-full h-[1px] bg-black"/>
                                    <button 
                                        onClick={()=>{
                                            orderStatusHandler(renderORLocalURL,preOrderInfo,"cancelada")
                                            cerrarModal()
                                        }} 
                                        className={`text-black hover:text-red-700  w-full text-center cursor-pointer`}> Cancelar definitivamente</button>
                                    <span className="w-full h-[1px] bg-black"/>
                                </div>

                            </Fragment>
                        )} 

                    </dialog>


                </span>

            </span>
               
        </Fragment>
    )
}