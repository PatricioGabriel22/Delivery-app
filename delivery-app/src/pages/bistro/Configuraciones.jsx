import { Fragment, useEffect, useState } from "react";

import BannerCloseLogo from "../../components/common/BannerCloseLogo";

import {useLoginContext} from '@context/LoginContext.jsx'
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { ccapitalizer_3000 } from "../../utils/capitalize";
import { GiConfirmed } from "react-icons/gi";









export default function Configuraciones(){

    const {userInfo} = useLoginContext()
    
    
    const [editIndex, setEditIndex] = useState(null)
    const [infoDelivery,setInfoDelivery] = useState([...userInfo.zonas_delivery])
    const [newPayloadCollector,setNewPayloadCollector] = useState({
        nuevas_zonas_precios:null,
        nueva_foto:null,
        nuevas_categorias:null
    })



    const [showConfig,setShowConfig] = useState({
        zonas_precios:false,
        foto:false,
        categorias:false
    })


    const handleChange = (e, index) => {
        const aux = [...infoDelivery]
        console.log(index)

        aux[index] = {
            ...aux[index],
            [e.target.name]: e.target.value
        }

        setInfoDelivery(aux)

    }

    const addNewField = ()=>{
        setInfoDelivery(prev=>{
            const aux ={
                zona:"Nueva zona",
                precio:"Pecio"
            }

            return [...prev,aux]
        })
    }

    const deleteField = (target,deleteMode)=>{
       
        let nuevasZonas = []

        switch(deleteMode){ 
            case 'zona':
                //En JavaScript, los bloques case deben estar entre llaves si vas a usar declaraciones como const, let o function, o lo declaro afuera para mantener uniformidad
                nuevasZonas = infoDelivery.filter(item => item.zona !== target.zona)
                setInfoDelivery(nuevasZonas)
                setNewPayloadCollector(prev=>({...prev, nuevas_zonas_precios:nuevasZonas}))
                break
            

              

        }

       

    }

    useEffect(()=>{
        console.log(newPayloadCollector)
    },[newPayloadCollector])
    
    return(
        <Fragment>

            <div className="text-white flex flex-col p-2 m-2 jystify-center items-center cursor-pointer relative">
                <button className="bg-sky-600 rounded text-2xl font-bold p-3  justify-self-center m-3">Guardar cambios</button>
               
                <p 
                    onClick={()=>setShowConfig((prev)=>({...prev,zonas_precios:!prev.zonas_precios}))}    
                    className="border-2 border-yellow-300 w-full md:w-[50%] text-center rounded text-xl font-bold py-2 my-2">
                Modificar zonas y precios de delivery</p>

                {showConfig.zonas_precios && (

                    <div  className=" text-white">
                        {infoDelivery.map((zona,index)=>(
                            <div className="flex flex-row items-center text-center justify-between border-1 m-2" key={index}>
                                <RiDeleteBin6Line size={30} className="text-red-600 ml-2" onClick={()=>deleteField(zona,"zona")}/>
                                {editIndex === index? (
                                    <Fragment key={index}>
                                        <input onChange={(e)=>handleChange(e,index)} value={infoDelivery[index]?.zona} name="zona" className="w-full text-lg p-2 text-center"/>
                                        <input onChange={(e)=>handleChange(e,index)} value={infoDelivery[index]?.precio} name="precio" className="w-22 text-lg p-2 text-center"/>
                                        <GiConfirmed size={40} onClick={()=>setEditIndex(null)} />


                                    </Fragment>
                                ):(
                                    <Fragment key={index}>
                                        
                                        <p className=" w-full text-lg p-2 ">{ccapitalizer_3000(zona.zona)}</p>
                                        <p className="w-38 text-lg p-2 text-center" >{zona.precio}</p>
            
                                        <MdModeEdit size={40} onClick={()=>setEditIndex(index)} />
                                    </Fragment>
                                )}

                            </div>    

                        ))}

                        <p 
                            onClick={()=>addNewField()}
                            className="flex justify-center items-center font-bold text-3xl  hover:border-2 hover:border-yellow-300 rounded">
                        +</p> 

                    </div>
                )}

                <p 
                    onClick={()=>setShowConfig((prev)=>({...prev,foto:!prev.foto}))}
                    className="border-2 border-yellow-300 w-full md:w-[50%] text-center rounded text-xl font-bold py-2 my-2">
                Cambiar foto presentacion</p>

                {showConfig.foto && (
                    <img width={300} loading="lazy" className="md:w-100 h-50 border-1 rounded object-contain" src="/logoApp.png"/>
                )}

                <p 
                    onClick={()=>setShowConfig((prev)=>({...prev,categorias:!prev.categorias}))}
                    className="border-2 border-yellow-300 w-full md:w-[50%] text-center rounded text-xl font-bold py-2 my-2">
                Eliminar categorias</p>
                
                {showConfig.categorias && (

                    <div  className=" text-white h-70 overflow-x-hidden">
                        {userInfo.categorias.map((categoria,index)=>(
                            <div className="flex flex-row items-center  justify-between border-1 m-2 " key={index}>
                                <p className=" text-lg p-2">{categoria}</p>
                                <RiDeleteBin6Line size={30} className="text-red-600"/>
                            </div>    

                            ))}
                    </div>
                )}



                
               
            </div>



        </Fragment>
    )
}