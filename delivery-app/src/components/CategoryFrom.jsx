/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'

import { useLoginContext } from "../context/LoginContext.jsx";
import { useShoppingContext } from "../context/ShoppingContext.jsx";


import { MdArrowBackIosNew } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";





export default function CategoryFrom(){

    const {socket} = useShoppingContext()
    const {userInfo,renderORLocalURL} = useLoginContext()

    const [loading,setLoading] = useState(false)
    const [infoTxt,setInfoTxt] = useState('')
    const [status,setStatus] = useState()

    function handleUploadCategoria(e){
        e.preventDefault()
        setLoading(!loading)
        
        const payloadNuevaCategoria = {
            id:userInfo.id,
            categoria:e.target[0].value.toLowerCase()
        }
        
        console.log(payloadNuevaCategoria)

        try {
            
            axios.post(`${renderORLocalURL}/addCategoriaAlPerfil`,payloadNuevaCategoria,{withCredentials:true})
                .then(res=>{
                    console.log(res)
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
            userInfo.categorias = [...new Set([...userInfo.categorias,...data.listaCategorias])]
            sessionStorage.setItem('userInfo',JSON.stringify(userInfo))
        })

        return ()=>{
            socket.off('categoriaAgregada')
        }
    },[])



    return(
        <Fragment>


            <div className="flex flex-col">
                <Link to={'/profile'} className="p-5 w-full text-start">
                    <MdArrowBackIosNew size={30}  />
                </Link>

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

            </div>


        </Fragment>
    )
}