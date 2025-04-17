/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useState } from "react";

import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";


import marineras from "../assets/marineras.jpg";
import { useShoppingContext } from "../context/ShoppingContext";
import { useLoginContext } from "../context/LoginContext";
import { ListaProductos } from "../utils/productos";


import axios from "axios";











export default function Card({id,nombre, precio, cantidadAdquirida,descripcion,disponible}) {
  // Estado para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toEdit,setTodit] = useState(false)
  const [editableData,setEditableData] = useState()

  // Estado para controlar la cantidad en el carrito
  const {carrito,setCarrito,cantidadVisualizer,cartHandler} = useShoppingContext()
  
  const {userInfo,renderORLocalURL} = useLoginContext()


  let precioInput = editableData?.precio

  if(precioInput !== 0 && precioInput !== ""){
    precioInput = precioInput || precio
  }




  function handleChangesDataCard(e){
    setEditableData({...editableData,[e.target.name]: e.target.value})
    
  }

  async function handleChangeStatus(){

    const statusInfo = {
      id:id,
      disponible:disponible
    }

    

    try {

      await axios.put(`${renderORLocalURL}/disponibilidad`, statusInfo, {withCredentials:true})
      
    } catch (error) {
      console.log(error)
    }

  }

  async function sendEditedProduct(){}



  useEffect(()=>{console.log(editableData)},[editableData])


  return (
    <div 
      className={`w-full sm:w-90 flex flex-col  text-black rounded-3xl m-5 bg-white `}>
        <div className={`flex flex-row items-center justify-center w-full relative `}>
          {toEdit ? 
            (<input 
              className="text-center bourder-2 rounded p-2 text-xl" 
              name="nombre"
              value={editableData?.nombre || nombre}
              onChange={(e)=>handleChangesDataCard(e)}
              />) 
            :
            (<p className="text-center rounded-t-2xl p-2 text-xl">{nombre}</p>)
          }
          {userInfo.rol && 
            <MdModeEdit 
              size={30} 
              className="absolute top-3 right-3 text-black cursor-pointer hover:bg-red-400 rounded"
              onClick={()=>{setTodit(!toEdit)}}
              />}
        </div>
      <span className="bg-red-600 h-[1px]" />

      <div className="flex flex-row p-4 gap-x-3 justify-around">

        {toEdit ? (
          <Fragment>
            <div className="flex flex-col justify-between gap-y-8">

              <textarea
              className="border-2 rounded "
              value={editableData?.descripcion || descripcion}
              name="descripcion"
              onChange={(e)=>handleChangesDataCard(e)}
              />

              <input
              type="number"
              className="self-center font-medium text-xl border-2 rounded text-center "
              value={precioInput}
              name="precio"
              onChange={(e)=>handleChangesDataCard(e)}
              />  

            </div>


            <label className="cursor-pinter hover:bg-red-400 rounded  text-center h-fit">
              Cambiar imagen
              <input
                type="file"
                className="hidden"
                onChange={(e)=>handleChangesDataCard(e)}
              />
            </label>


          

          </Fragment>
        ): 
          (
          <Fragment>

            <div className="flex flex-col justify-between">
              <span>{descripcion}</span>
              <p className="self-center font-medium text-xl">${precio}</p>
            </div>

            {/* Imagen que abre el modal */}
            <img
              src={marineras}
              className="w-20 h-32 rounded cursor-pointer select-none object-cover"
              onClick={() => setIsModalOpen(true)}
              alt="Marineras"/>
          </Fragment>
          )
        }
      </div>


     

      <div className="justify-around items-center flex flex-row w-full">

        {userInfo.rol ? (
          <Fragment>
  
            <div className={`w-full rounded-b-xl b p-4 flex items-center gap-3 ${disponible ? "bg-green-100":"bg-red-100"} `}>
              <button
                className={`rounded-full w-9 h-9 transition-colors duration-300 cursor-pointer ${
                  disponible ? 'bg-green-600' : 'bg-red-600'
                }`}
                onClick={handleChangeStatus}
                aria-label="Cambiar disponibilidad del producto"
              />

              <span className="font-semibold text-gray-800">
                {disponible ? 'Producto disponible' : 'Producto no disponible'}
              </span>
            </div>
          
          </Fragment>
          
        ):(
          <Fragment>

            <MdDelete 
              size={40} 
              className="text-red-600 cursor-pointer"  
              onClick={()=>cartHandler(carrito,"delete",nombre)}
            />
    
            
            <FaPlus
              size={40}
              className="text-green-600 cursor-pointer"
              onClick={()=>{
                cartHandler(carrito,"add",nombre)
                // cantidadVisualizer()
              }
    
    
              }
            />
              
            <span className={`text-3xl self-end ${cantidadAdquirida === 0? "invisible":"block"}`}>x{cantidadAdquirida}</span> 
          </Fragment>
          





        )}



      </div>



      {/* Modal para la imagen en grande */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-white p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()} // Evita que al hacer clic dentro del modal se cierre
          >
            <img
              src={marineras}
              className="max-w-full max-h-[90vh] rounded"
              alt="Marineras"
            />

            {/* Botón de cierre */}
            <button
              onClick={() => setIsModalOpen(false)}   
              className="absolute top-2 right-2 text-white bg-red-500 rounded px-3 py-2"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

