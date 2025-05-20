import { Fragment } from "react";
import BannerCloseLogo from "@components/common/BannerCloseLogo";
import { verFecha, verHoraYMinutos } from "../../utils/dateFunctions";







export default function ConfirmedOrderModal({ref,close,confirmedOrder}){

    if (!confirmedOrder) return;

    const {productos,costoEnvio,importeTotal,formaDeEntrega,createdAt} = confirmedOrder




    return(
        <Fragment>

            <dialog 

                ref={ref} 
                className="rounded-xl p-6 shadow-xl w-full md:w-[45%]  justify-self-center self-center backdrop:bg-black/50 text-xl overflow-x-hidden font-semibold">

                <BannerCloseLogo close={close}/>
               
                <p className="text-center">{verFecha(createdAt)} | {verHoraYMinutos(createdAt)}</p>

                <div className="w-full h-[1px] my-8 bg-black"/>
                    


            
                <div className="h-[10%]">

                    {productos.map((producto)=>( 
                        
                        <div className="flex flex-row w-full justify-between p-1" key={producto._id}>
                            <p className=" text-end">{producto.cantidad}X {producto.nombre}</p>
                            <p className=" text-end">${producto.precio* producto.cantidad}</p>

                        </div>
                        

                    ))}

                    
                        
                    {formaDeEntrega === "Envio" ? (
                        <p className="text-end">Envio: ${costoEnvio}</p>

                    ):(
                        <p className="text-end">{formaDeEntrega}</p>
                    )}

                

                    <p className="text-end py-8 m-auto">Total: ${importeTotal}</p>
                </div>

            </dialog>


        </Fragment>
    )



}



