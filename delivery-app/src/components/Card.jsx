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
import { ccapitalizer_3000 } from "../utils/capitalize";











export default function Card({id,nombre, precio, cantidadAdquirida,descripcion,disponible}) {
  // Estado para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toEdit,setTodit] = useState(false)
  const [editableData,setEditableData] = useState()

  // Estado para controlar la cantidad en el carrito
  const {carrito,setCarrito,cantidadVisualizer,cartHandler} = useShoppingContext()
  
  const {userInfo,renderORLocalURL} = useLoginContext()


  
  
  function clearInputs(inputValue,defaultValue){


  
    if(inputValue !== 0 && inputValue !== ""){
      inputValue = inputValue || defaultValue
    }

    return inputValue
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

  async function sendEditedProduct(){
    console.log(editableData)
    if(editableData){
      
      const formDataNewInfo = new FormData()
       
      for (let key in editableData){
        formDataNewInfo.append(key,editableData[key])
      }
      
      formDataNewInfo.append('id',id)

      axios.put(`${renderORLocalURL}/editProductInfo`,formDataNewInfo,
        {
          withCredentials:true,
          headers:{'Content-Type': 'multipart/form-data'}
        })
        .then(res=>console.log(res))
        .catch(e=>console.log(e))
    }



  }



  return (
    <div 
      className={`w-90 flex flex-col  text-black rounded-3xl mt-3 md:m-5 bg-white `}>
        <div className={`flex flex-row items-center justify-center w-full `}>
          {toEdit ? 
            (<input 
              className="text-center border-2 p-5 text-xl w-[70%] rounded-t-3xl mr-auto" 
              name="nombre"
              value={clearInputs(editableData?.nombre,nombre)}
              onChange={(e)=>handleChangesDataCard(e)}
              />) 
            :
            (<p className="text-center rounded-t-2xl py-4 text-xl text-wrap">{ccapitalizer_3000(nombre)}</p>)
          }

          {
            toEdit && (
              <buttton 
                onClick={()=>{sendEditedProduct()}}
                className="hover:bg-sky-400 rounded p-2 m-auto">Guardar</buttton>
            )
          }


        </div>
      <span className="bg-red-600 h-[1px]" />

      <div className="flex flex-row md:p-4 md:gap-x-3 justify-around">

        {toEdit ? (
          <Fragment>
            <div className="flex flex-col justify-between p-2 gap-y-8">

              <textarea
              className="border-2 rounded "
              value={clearInputs(editableData?.descripcion,descripcion)}
              name="descripcion"
              onChange={(e)=>handleChangesDataCard(e)}
              />

              <input
              type="number"
              className="self-center font-medium text-xl border-2 rounded text-center "
              value={clearInputs(editableData?.precio,precio)}
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

            <div className="flex flex-col justify-between p-2">
              <span>{descripcion}</span>
              <p className="self-center font-medium text-xl">${precio}</p>
            </div>

            {/* Imagen que abre el modal */}
            <img
              src={marineras}
              className="w-28 h-38 m-1 rounded cursor-pointer select-none object-cover"
              onClick={() => setIsModalOpen(true)}
              alt="Marineras"/>
          </Fragment>
          )
        }
      </div>


     

      <div className="justify-around items-center flex flex-row w-full">

        {userInfo.rol === 'admin' ? (
          <Fragment>
  
            <div className={`w-full rounded-b-xl  p-4 flex justify-between gap-3 ${disponible ? "bg-green-100":"bg-red-100"} `}>

              <div className="flex flex-row items-center gap-2 cursor-pointer" onClick={handleChangeStatus}>

                <button
                  className={`rounded-full w-9 h-9 transition-colors duration-300 cursor-pointer ${
                    disponible ? 'bg-green-600' : 'bg-red-600'
                  }`}

                  aria-label="Cambiar disponibilidad del producto"
                />

                <span className="font-semibold text-gray-800">
                  {disponible ? 'Disponible' : 'No disponible'}
                </span>
              </div>
  
              <div className="flex flex-row items-center gap-2">

                <MdModeEdit 
                  size={30} 
                  className={`text-black cursor-pointer hover:bg-yellow-400 rounded`}
                  onClick={()=>{setTodit(!toEdit)}}
                />

                <MdDelete
                  size={30}
                  className={`text-black cursor-pointer hover:bg-red-400 rounded`}

                />
              </div>
          
              
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

