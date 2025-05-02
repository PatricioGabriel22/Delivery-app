/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useRef, useState } from "react";

import { MdDelete } from "react-icons/md";
import { FaExclamationTriangle, FaPlus } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";


import marineras from "../assets/marineras.jpg";
import { useShoppingContext } from "../context/ShoppingContext";
import { useLoginContext } from "../context/LoginContext";
import { ListaProductos } from "../utils/productos";


import axios from "axios";
import { ccapitalizer_3000 } from "../utils/capitalize";
import toast from "react-hot-toast";
import { useCatalogMaker } from "../context/SWR";
import { useCatalogContext } from "../context/CatalogContext";











export default function Card({id,nombre, precio, cantidadAdquirida,descripcion,disponible}) {
  // Estado para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toEdit,setTodit] = useState(false)
  const [editableData,setEditableData] = useState()

  // Estado para controlar la cantidad en el carrito
  const {carrito,setCarrito,cantidadVisualizer,cartHandler} = useShoppingContext()
  
  const {userInfo,renderORLocalURL} = useLoginContext()

  const {catalogoDelAdmin,refresh} = useCatalogContext()


  
  
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
    setTodit(!toEdit)
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

  async function borrarProducto(){
    
    //hago u nbackup de la data para tener en caso de emergencia
    const rollback = catalogoDelAdmin

    //elimino el ide  lo que quiero eliminar con un refresco de SWR (Esto es solo visual)
    refresh(prevData=>{
      const nuevaData = prevData.catalogoDelAdmin.filter(data=> data._id !== id)


      return({
        ...prevData,
        catalogoDelAdmin: nuevaData
      })

    },{revalidate:false})

    try {
      //aca si ejecuto por detras la eliminacion definitiva en la DB
      
      await toast.promise(
          axios.delete(`${renderORLocalURL}/eliminarProducto/${id}`, {withCredentials:true}),
         {
           loading: 'Eliminando...',
           success:(res) =>  res.data.message || "Producto eliminado!",
           error: (res) => res.data.error || "No se pudo eliminar el producto",
           duration: 1000 * 2
         }
      )
    } catch (error) {
      //y si ago sale mal uso el rollback para volver a incorporarlo al catalogo
      refresh(prevData=>{
        return{
          ...prevData,
          catalogoDelAdmin: rollback
        }
      },{revalidate:false})
    }


  }

  const alertDelete = ()=>{
    toast((t) => (
      <span className="flex flex-col ">
        <p className="justify-self-end text-end w-full m-auto cursor-pointer " onClick={()=>toast.dismiss(t.id)}>X</p>
        <FaExclamationTriangle className="text-red-500 text-5xl self-center" />
        <p className="font-semibold">¿Seguro que desea eliminar {ccapitalizer_3000(nombre)}?</p>

        <div className="flex flex-row justify-around p-3">

          <button onClick={()=>{toast.dismiss(t.id); borrarProducto()}} className="bg-red-400 hover:bg-red-500 p-2 font-bold rounded border-1 cursor-pointer">
            Eliminar
          </button>

          <button onClick={()=>toast.dismiss(t.id)} className="rounded border-1 p-2 cursor-pointer">
            No
          </button>
        </div>

      </span>
    ));
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
              //pero mejor hacer un cartel de estaas "seguro?" IMPORTANTE
              />) 
            :
            (<p className="text-center rounded-t-3xl py-5 text-xl text-wrap">{ccapitalizer_3000(nombre)}</p>)
          }

          {
            toEdit && (
              <buttton 
                onClick={()=>{sendEditedProduct()}}
                className="hover:bg-sky-400 rounded p-2 m-auto cursor-pointer">Guardar</buttton>
            )
          }


        </div>
      <span className="bg-red-600 h-[1px]" />

      <div className="flex flex-row md:p-4 md:gap-x-3 justify-around">

        {toEdit ? (
          <Fragment>
            <div className="flex flex-col justify-between p-2 gap-y-8 ">

              <textarea
              className="border-2 rounded my-4  "
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


            <label className="cursor-pointer hover:bg-red-400 rounded  text-center h-fit m-2 ">
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
                  onClick={()=>{alertDelete()}}
                  
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

