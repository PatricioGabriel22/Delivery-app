import { BadgeHelp, Copy } from "lucide-react";
import { Fragment, useMemo, useState } from "react";


import { useLoginContext } from "@context/LoginContext.jsx";
import { useBistroContext } from "../../context/BistrosContext";






export default function Help(){

    const {userInfo} = useLoginContext()
    const {bistroInfo} = useBistroContext()

    const [help,setHelp] = useState(false)
    const [copiadoIndex, setCopiadoIndex] = useState(null)  

    const numeros = useMemo(()=>[{
        nombre: userInfo.rol ? userInfo.username : bistroInfo.username,
        telefono:userInfo.rol ? userInfo.telefono : bistroInfo.telefono},
        {nombre:"Soporte",telefono:1151278287}]
    ,[bistroInfo,userInfo])

    const copiarAlPortapapeles = async (num,index) => {
        try {
            await navigator.clipboard.writeText(num);
            setCopiadoIndex(index);
            setTimeout(() => setCopiadoIndex(false), 2000); // Mensaje por 2 seg
        } catch (err) {
        console.error("Error al copiar", err);
        }
    }



    return(
        <Fragment>
                {help ? (
                <div className="flex flex-col justify-center items-center md:justify-around  md:flex-row w-full relative ">
                    <p className="absolute self-end top-0 right-2 font-bold  text-lg cursor-pointer" onClick={()=>setHelp(!help)}>X</p>
        
                    {numeros.map((numero,index)=>{
                    return(
                        
                    <div className="flex items-center " key={index}>
                        <p className="text-center px-2">{numero.nombre}: </p> 
                        <span >{numero.telefono}</span>
                        <button
                        onClick={()=>copiarAlPortapapeles(numero.telefono,index)}
                        className={` ${copiadoIndex === index ? 'bg-green-600' : "bg-blue-600" }  text-white p-1 m-1 flex flex-row rounded ` }
                        >
                        <Copy size={16} />
                        {copiadoIndex === index ? "Copiado!" : "Copiar"}
                        </button>
                        
                    </div>
                    )
                    })}
        
                </div>
                ) :(<BadgeHelp size={30}  onClick={()=>setHelp(!help)} className="text-blue-600 self-end absolute top-0 cursor-pointer m-2"/>)}
        </Fragment>
    )
}