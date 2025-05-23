import { Fragment, useRef, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";


import { useLoginContext } from "@context/LoginContext";
import { useShoppingContext } from "@context/ShoppingContext";
import { decidirCostoEnvio } from "../../utils/envioFunctions";
import BannerCloseLogo from "@components/common/BannerCloseLogo";
import { ccapitalizer_3000 } from "../../utils/capitalize";





export default function IncomingPreOrder({title,preOrderInfo,activeButtons = true}){

    const {formaDeEntrega,importeTotal,confirmed,finished,delivered,paymentMethod,_id} = preOrderInfo

    const {username} = preOrderInfo.userInfo



    const {renderORLocalURL} = useLoginContext()

    const {orderStatusHandler} = useShoppingContext()

    const [flagMsgSugerencias,setFlagMsgSugerencias] = useState(false)

    const [checkDone,setCheckDone] = useState(new Set())
 

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


    function checkItem(indexDelProducto){
        setCheckDone(prev=>{
            const setDeCheckeados = new Set(prev)

            if(setDeCheckeados.has(indexDelProducto)){
                setDeCheckeados.delete(indexDelProducto)
            }else{
                setDeCheckeados.add(indexDelProducto)
            }

            return setDeCheckeados
        })
    }



    return(
        <Fragment>

            <div className="bg-white  h-38 rounded-xl text-black flex flex-col gap-y-2 m-2  mb-10 ">
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
                            className="text-xl font-semibold rounded-lg hover:bg-gray-300 p-2 self-center text-center w-fit cursor-pointer"
                            onClick={()=>abrirModal()}
                            >Ver pre-orden
                        </p>

                        {title === "Aceptadas" && 
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


                            )
                        }

                    </div>      

                    <dialog ref={dialogRef} className={`rounded-xl p-2 shadow-xl w-full md:w-160 min-h-screen justify-self-center self-center backdrop:bg-black/50 border-5 ${formaDeEntrega === 'Envio' ? "border-red-500" : "border-sky-500"} }`}>
                        <BannerCloseLogo close={cerrarModal} />

                        <div className="flex flex-col text-lg ">
                            <p className="font-bold">Nombre: {preOrderInfo.userInfo.username}</p>
                            <p className="font-bold">Telefono: {preOrderInfo.userInfo.telefono}</p>
                            <p className="font-bold">Direccion: {preOrderInfo.userInfo.direccion}</p>
                            <p className="font-bold">Entrecalles/Esquina: {preOrderInfo.userInfo.entreCalles}</p>
                            <span className="h-[1px] w-full bg-red-700 mt-2" />
                            <p className="font-bold ">Pedido:</p>

                            

                            <div className="flex flex-col h-58 overflow-x-hidden">
                                {preOrderInfo.preOrder.map((item,index)=>(

                                    <div 
                                        key={index}
                                        className={`flex flex-row justify-between w-full p-2 items-center text-xl border-1 my-1 cursor-pointer ${checkDone.has(index) ? "bg-green-300" : ""} `}
                                        onClick={()=>checkItem(index)}
                                    >
                                        <p>{item.cantidad}x {ccapitalizer_3000(item.nombre)}</p>
                                        <p>${item.precio * item.cantidad}</p>

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

                            
                            <span className="font-semibold text-center p-5">{paymentMethod ? `Metodo de pago: ${paymentMethod}` : "Pago pendiente"}</span>
                            



                        </div>

                        {activeButtons && (
                            <Fragment>

                                <div className="flex flex-row justify-around bg-gray-300  rounded-full w-full cursor-pointer">
                                    {title === "Pre-Ordenes" ? (
                                        <Fragment>
                                            <div className="flex flex-col items-center">

                                                <MdOutlineCancel 
                                                    size={80} 
                                                    className={`text-red-600 hover:text-red-700 ${flagMsgSugerencias ? "text-center":""} `}
                                                    onClick={()=>{
                                                        
                                                        setFlagMsgSugerencias(!flagMsgSugerencias)
                                                    }}
                                                />
                                                <p className="font-bold">Sugerirle cambios al cliente</p>
                                            </div>

                                            <div className={`flex flex-col items-center ${confirmed || flagMsgSugerencias? "hidden":""}`}>

                                                <GiConfirmed 
                                                    size={80} 
                                                    className={`text-green-600 hover:text-green-700  `}
                                                    onClick={()=>{
                                                        orderStatusHandler(renderORLocalURL,preOrderInfo,"aceptada")
                                                        cerrarModal()
                                                    }}
                                                />
                                                <p className="font-bold">Aceptar</p>
                                            </div>
        
        
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
                                        
        
                                    </Fragment>
                                )} 
                                <div className="flex flex-row w-full justify-center items-center mt-5">
                                    <span className="w-full h-[1px] bg-black"/>
                                    <button 
                                        onClick={()=>{
                                            orderStatusHandler(renderORLocalURL,preOrderInfo,"cancelada")
                                            cerrarModal()
                                        }} 
                                        className={`text-black hover:text-red-700  w-full text-center cursor-pointer`}> Cancelar definitivamente</button>
                                    <span className="w-full h-[1px] bg-black"/>
                                </div>
                            </Fragment>)


                        }

                    </dialog>


                </span>

            </div>
               
        </Fragment>
    )
}