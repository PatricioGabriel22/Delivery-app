/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'

import { useLoginContext } from "@context/LoginContext.jsx";
import { useSocketContext } from "@context/SocketContext.jsx";


import { MdArrowBackIosNew } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";





export default function CategoryFrom(){

    const {socket} = useSocketContext()
    const {userInfo,renderORLocalURL} = useLoginContext()

    const [loading,setLoading] = useState(false)
    const [infoTxt,setInfoTxt] = useState('')
    const [status,setStatus] = useState()

    function handleUploadCategoria(e){
        e.preventDefault()
        setLoading(!loading)
        
        const payloadNuevaCategoria = {
            id:userInfo._id,
            categoria:e.target[0].value.toLowerCase().trim()
        }
        
     
        try {
            
            axios.post(`${renderORLocalURL}/addCategoriaAlPerfil`,payloadNuevaCategoria,{withCredentials:true})
                .then(res=>{
                    
                    setStatus(res.status) 
                    setInfoTxt(res.data.message)
                    setLoading(false)
                })

        } catch (error) {
            console.log(error)
        }

    }

    setTimeout(()=>{
        setInfoTxt('')
        setStatus('')
    },10000)

    useEffect(()=>{

        socket.on('categoriaAgregada',(data)=>{
            
            userInfo.categorias = [...new Set(data.listaCategorias)]
            localStorage.setItem('userInfo',JSON.stringify(userInfo))
        })

        return ()=>{
            socket.off('categoriaAgregada')
        }
    },[])



    return(
        <Fragment>


            <div className="flex flex-col gap-y-30 justify-center items-center">

                <form
                    onSubmit={handleUploadCategoria}
                    className="w-[90%] md:w-[40%] self-center  bg-white border-2 border-red-700 shadow-md rounded-2xl p-8 flex flex-col  gap-6 text-black  "
                    >
                        <h2 className="text-2xl font-bold text-center text-red-700">Agregar nueva categoria</h2>
                            
                            <span className='w-full h-[1px] bg-black' />




                        <input
                            type="text"
                            name="categoria"
                            placeholder="Categoría"
                            className="border border-red-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                            required
                        />





                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-all"
                        >
                            {loading ? 'Guardando...' : 'Guardar categoria'}
                        </button>
                </form>

                {status === 200 && (

                    <div className="w-full  p-10 flex flex-col items-center">
                        <GiConfirmed  size={120} className="text-green-700"/>
                        <span className="p-2 text-xl"/>{infoTxt}
                    </div>
                )}


                <Link to={'/addProduct'}>
                    <button className="w-90 justify-center items-center rounded border-2 border-red-600 p-3 cursor-pointer">
                        <p className="text-lg font-semibold">Agregar producto</p>
                    </button>
                </Link>

            </div>


        </Fragment>
    )
}