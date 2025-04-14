import { Fragment, useState } from "react";


import axios from 'axios'
import { useLoginContext } from "../context/LoginContext";



import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";



export default function CategoryFrom(){

    const {renderORlocalURL} = useLoginContext()

    const [loading,setLoading] = useState(false)


    function handleUploadCategoria(e){
        e.preventDefault()
        setLoading(!loading)
        
        const nuevaCategoria = e.target[0].value.toLowerCase()
        
        console.log(nuevaCategoria)
        axios.post(`${renderORlocalURL}/addCategoriaAlPerfil`,{nuevaCategoria},{withCredentials:true})

    }

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
            </div>


        </Fragment>
    )
}