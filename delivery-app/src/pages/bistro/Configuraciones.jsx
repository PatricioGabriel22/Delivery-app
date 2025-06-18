import { Fragment, useEffect, useState } from "react";
import axios from 'axios'

import BannerCloseLogo from "@components/common/BannerCloseLogo";

import {useLoginContext} from '@context/LoginContext.jsx'


import { RiDeleteBin6Line, RiPerplexityFill } from "react-icons/ri";
import { MdModeEdit, MdOutlineImageSearch } from "react-icons/md";
import { ccapitalizer_3000 } from "../../utils/capitalize";
import { GiConfirmed } from "react-icons/gi";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa6";










export default function Configuraciones(){

   
    const {userInfo,renderORLocalURL} = useLoginContext()
    
    
    
    const [editIndex, setEditIndex] = useState(null)
    const [infoDelivery,setInfoDelivery] = useState([...userInfo.zonas_delivery])
    // const [imgPresentacion,setImgPresentacion] = useState(userInfo.img)
    const [categorias,setCategorias] = useState([...userInfo.categorias || []])

    const [preview,setPreview] = useState(userInfo.img || '/logoApp.png')

    const [loadingBTN,setLoadingBTN] = useState(false)



    const [newPayloadCollector,setNewPayloadCollector] = useState({
        nuevas_zonas_precios:[...userInfo.zonas_delivery || []],
        nueva_foto:null,
        nuevas_categorias:[...userInfo.categorias || []]
    })



    const [showConfig,setShowConfig] = useState({
        zonas_precios:false,
        foto:false,
        categorias:false
    })




    const handleChange = (e, index) => {
        //cambia la informacion dentro de un array de objetos
        const aux = [...infoDelivery]
  
        aux[index] = {
            ...aux[index],
            [e.target.name]:  e.target.name === 'precio' ?  Number(e.target.value) : String(e.target.value)
        }

    
        setNewPayloadCollector(prev=>({...prev,nuevas_zonas_precios:aux}))
        setInfoDelivery(aux)

    }


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file))
            setNewPayloadCollector(prev=>({...prev,nueva_foto:file}))

        } else {
         setPreview(null);
        }

        e.target.value = null
    }

    const addNewField = ()=>{
        setInfoDelivery(prev=>{
            const aux ={
                zona:"Nueva zona",
                precio:0
            }

            return [...prev,aux]
        })
    }


    const deleteField = (target,deleteMode)=>{
       
        let nuevo = []

        switch(deleteMode){ 
            case 'zona':
                //En JavaScript, los bloques case deben estar entre llaves si vas a usar declaraciones como const, let o function, o lo declaro afuera para mantener uniformidad
                nuevo = infoDelivery.filter(item => item.zona !== target.zona)
                setInfoDelivery(nuevo)
                setNewPayloadCollector(prev=>({...prev, nuevas_zonas_precios:nuevo}))
                break
            case 'imagen':
                setNewPayloadCollector(prev=>({...prev,nueva_foto:null}))
                setPreview('/logoApp.png')
                break
            case 'categoria':
                nuevo = categorias.filter(categoria => categoria !== target)
                console.log(nuevo)
                setCategorias(nuevo)
                setNewPayloadCollector(prev=>({...prev, nuevas_categorias:nuevo}))

                break

              

        }

       

    }


    async function guardarCambios(){
        setLoadingBTN(true)


        const formDataNewInfo = new FormData()
       
        formDataNewInfo.append('nuevas_zonas_precios',JSON.stringify(newPayloadCollector.nuevas_zonas_precios))
        formDataNewInfo.append('nueva_foto',newPayloadCollector.nueva_foto)
        formDataNewInfo.append('nuevas_categorias',JSON.stringify(newPayloadCollector.nuevas_categorias))


        try {
            
            const res = await axios.post(`${renderORLocalURL}/nuevaConfiguracion/${userInfo._id}`,formDataNewInfo,{withCredentials:true,headers:{'Content-Type': 'multipart/form-data'}})
            setLoadingBTN(false)
            toast.success(res.data.message)

        } catch (error) {
            console.log(error)
            setLoadingBTN(false)


        }   

    }


    useEffect(()=>{


        console.log(newPayloadCollector)

    },[newPayloadCollector])
    
    return(
        <Fragment>

            <div className="text-white flex flex-col p-2 m-2 jystify-center items-center cursor-pointer relative">
                <button 
                    onClick={guardarCambios}
                    className={`bg-sky-600 rounded text-2xl font-bold p-3 justify-self-center m-3 cursor-pointer ${loadingBTN ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                        {loadingBTN ? (
                            <div className="flex flex-row items-center gap-x-2">
                                <FaSpinner className="animate-spin" />
                                <p>Guardando...</p>
                            </div>
                        ):"Guardar cambios"}
                        
                </button>
               
                <p 
                    onClick={()=>setShowConfig((prev)=>({...prev,zonas_precios:!prev.zonas_precios}))}    
                    className="border-2 border-yellow-300 w-full md:w-[50%] text-center rounded text-xl font-bold py-2 my-2">
                Modificar zonas y precios de delivery</p>

                {showConfig.zonas_precios && (

                    <div  className=" text-white w-full md:w-[50%]">
                        {infoDelivery.length > 0 && infoDelivery.map((zona,index)=>(
                            <div className="flex flex-row items-center text-center justify-between border-1 m-2 " key={index}>
                                <RiDeleteBin6Line size={35} className="text-red-600 ml-2" onClick={()=>deleteField(zona,"zona")}/>
                                {editIndex === index? (
                                    <Fragment key={index}>
                                        <input required={true} onChange={(e)=>handleChange(e,index)} value={infoDelivery[index]?.zona} name="zona" className="w-full text-lg p-2 text-center"/>
                                        <input required={true} type="number" onChange={(e)=>handleChange(e,index)} value={infoDelivery[index]?.precio} name="precio" className="w-34 text-lg p-2 mr-8 text-center"/>
                                        <GiConfirmed size={40} onClick={()=>{setEditIndex(null)}} />


                                    </Fragment>
                                ):(
                                    <Fragment key={index}>
                                        
                                        <p className=" w-full text-lg p-2 ">{ccapitalizer_3000(zona.zona)}</p>
                                        <p className="w-38 text-lg p-2 mr-8 text-center" >{zona.precio}</p>
            
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
                    <Fragment>
                        <div className="flex flex-row items-center justify-center gap-x-40 w-full pb-2">
                            <label>
                                <MdOutlineImageSearch size={30} className="text-end"/>
                                <input type="file" onChange={handleImageChange} className="hidden"/>
                               

                            </label>

                            <span className="text-2xl font-bold text-red-600" onClick={()=>deleteField(preview,'imagen')}>X</span>
                        </div>

                        <img width={350}  loading="lazy" className="h-55 border-1 rounded object-cover" src={preview}/>
                    
                        
                    </Fragment>
                )}

                <p 
                    onClick={()=>setShowConfig((prev)=>({...prev,categorias:!prev.categorias}))}
                    className="border-2 border-yellow-300 w-full md:w-[50%] text-center rounded text-xl font-bold py-2 my-2">
                Eliminar categorias</p>
                
                {showConfig.categorias && (

                    <div  className=" text-white h-70  overflow-x-hidden w-full md:w-[30%]">
                        {categorias.length >0 && categorias.map((categoria,index)=>(
                            <div className="flex flex-row items-center  justify-between border-1 m-2 " key={index}>
                                <p className=" text-lg p-2 ">{ccapitalizer_3000(categoria)}</p>
                                <RiDeleteBin6Line size={30} className="text-red-600" onClick={()=>deleteField(categoria,'categoria')}/>
                            </div>    

                            ))}
                    </div>
                )}



                
               
            </div>



        </Fragment>
    )
}