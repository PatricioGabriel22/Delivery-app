/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import { MdDelete } from "react-icons/md";
import { FaExclamationTriangle, FaPlus } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";



import { useShoppingContext } from "@context/ShoppingContext";
import { useLoginContext } from "@context/LoginContext";
import { ListaProductos } from "../../utils/productos";


import axios from "axios";
import { capitalize, ccapitalizer_3000 } from "../../utils/capitalize";
import toast from "react-hot-toast";
import { useCatalogMaker } from "@context/SWR";
import { useCatalogContext } from "@context/CatalogContext";
import { useSocketContext } from "@context/SocketContext";




import { MdOutlineImageSearch } from "react-icons/md";
import BannerCloseLogo from "@components/common/BannerCloseLogo";






export default function Card({id,nombre, precio, cantidadAdquirida,descripcion,disponible,img}) {
  // Estado para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toEdit,setTodit] = useState(false)
  const [editableData,setEditableData] = useState()

  const [miniPreview,setMiniPreview] = useState(null)

  // Estado para controlar la cantidad en el carrito
  const {carrito,cartHandler,loading, buyBTN} = useShoppingContext()
  
  const {userInfo,renderORLocalURL} = useLoginContext()

  const {refresh} = useCatalogContext()

  const capitalizedNombre = useMemo(() => ccapitalizer_3000(nombre), [nombre])
  const editImgModalRef = useRef(null)

  function openCloseEditPreviewModal(modalTarget,action){

    if(action === 'open'){

      modalTarget.current.showModal()
      modalTarget.current.scrollTop = 0

    }else if(action === 'close'){

      modalTarget.current.close()

    }
  }

  
  function clearInputs(inputValue,defaultValue){


  
    if(inputValue !== 0 && inputValue !== ""){
      inputValue = inputValue || defaultValue
    }

    return inputValue
  }

  
  function handleChangesDataCard(e,flagTemporal){
   

    const nombreCampo = e.target.name
    const infoGuardada = nombreCampo !== 'imagen' ? e.target.value : e.target.files[0]

    setEditableData({...editableData,[nombreCampo]: infoGuardada})

    if(flagTemporal){
      const pathLogo = 'https://res.cloudinary.com/db8wo1wrm/image/upload/v1746541592/productos/sxc84fxav3vdaoz1jouf.png'

      setMiniPreview(pathLogo)

     setEditableData({...editableData,[nombreCampo]: flagTemporal})

    }
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

  function miniPreviewOnEdit(e){
    const imagen = e.target.files[0]
    if(!imagen) setMiniPreview(false)

    setMiniPreview(URL.createObjectURL(imagen))
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
    const axiosPromise = axios.delete(`${renderORLocalURL}/eliminarProducto/${id}`, {withCredentials:true})
    try {
      //aca si ejecuto por detras la eliminacion definitiva en la DB
      toast.promise(
        axiosPromise,
        {
          loading: 'Eliminando...',
          success:(res) => {
            // console.log(res) las res de axios viene para aca
            return capitalize(res.data.message) || "Producto eliminado!"},
          error: (res) => capitalize(res.data.error) || "No se pudo eliminar el producto",
        })
    } catch (error) {
      //y si ago sale mal uso el rollback para volver a incorporarlo al catalogo
      refresh()
    }


  }

  const alertDelete = ()=>{
    toast((t) => (
      <span className="flex flex-col ">
        <p className="justify-self-end text-end w-full m-auto cursor-pointer " onClick={()=>toast.dismiss(t.id)}>X</p>
        <FaExclamationTriangle className="text-red-500 text-5xl self-center" />
        <p className="font-semibold">¿Seguro que desea eliminar {capitalizedNombre}?</p>

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
            (<p className="text-center rounded-t-3xl py-5 text-xl text-wrap">{capitalizedNombre}</p>)
          }

          {
            toEdit && (
              <button 
                onClick={()=>{sendEditedProduct()}}
                className="hover:bg-sky-400 rounded p-2 m-auto cursor-pointer">Guardar</button>
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


            <label className="cursor-pointer hover:bg-red-400 rounded  text-center m-auto" onClick={()=>openCloseEditPreviewModal(editImgModalRef,'open')}>
              Cambiar imagen
            </label>
              <dialog className="fixed inset-0 m-auto w-full md:w-[45%] max-h-[90vh] rounded-xl p-2 shadow-xl backdrop:bg-black/50 text-xl font-semibold z-50" ref={editImgModalRef} >


                <BannerCloseLogo close={()=>openCloseEditPreviewModal(editImgModalRef,'close')}/>
                <p className=" text-3xl font-bold text-center flex flex-col mb-6">
                  Seleccione la nueva imagen del producto
                  <span className="w-full h-[1px] mt-3 bg-red-600"/>
                </p>
                <div className="flex flex-col gap-y-5 md:flex-row justify-center md:justify-around mt-auto">
                
              
                  <div className="flex flex-col items-center">
                    <p>Anterior</p>
                    <img src={img} className=" w-58 h-60 rounded-2xl "/>
                  </div>

                  <div className="flex flex-col items-center">
                    <p onClick={()=>setMiniPreview(null)} className={`cursor-pointer select-none`}>{miniPreview ? "Cambiar":"Nueva"}</p>
                    
                    {miniPreview ? (<img src={miniPreview} className="w-58 h-60 rounded-2xl"/>) 
                      : (
                      <label className="w-58 h-60 text-center flex flex-col justify-center items-center cursor-pointer bg-red-500 rounded">
                        Seleccionar imagen
                          <MdOutlineImageSearch size={80} />
                          <input
                          name='imagen'
                          type="file"
                          className="hidden"
                          onChange={(e)=>{handleChangesDataCard(e); miniPreviewOnEdit(e)}}
                        />
                      </label>)
                    }
                  </div>
                </div>

                <div className="md:mt-20">

                  <button name="temporalIMG" className="rounded-full bg-red-600 w-full p-2 my-2 cursor-pointer" onClick={(e)=>handleChangesDataCard(e,true)}>Colocar imagen temporal</button>

                  <button  className="rounded-full bg-red-600 w-full p-2 my-2 cursor-pointer" onClick={()=>openCloseEditPreviewModal('close')}>Aceptar</button>
                </div>
                

              </dialog>


          

          </Fragment>
        ): 
          (
          <Fragment>

            <div className="flex flex-col justify-between p-2 ">
              <span className="overflow-x-hidden h-30">{descripcion}</span>
              <p className="self-center font-medium text-xl">${precio}</p>
            </div>

            {/* Imagen que abre el modal */}
            <img
              className="w-30 h-38 m-1 rounded cursor-pointer select-none object-cover"
              onClick={() => setIsModalOpen(true)}
              src={img || '/logoApp.png'}
              alt={`${nombre}` || "Logo de la app"}/>
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
                
                {toEdit ? (
                  <p className="bg-red-600 rounded text-white p-1 cursor-pointer" onClick={()=>{setTodit(!toEdit)}}>Cancelar</p>
                ):(
                  <MdModeEdit 
                    size={30} 
                    className={`text-black cursor-pointer hover:bg-yellow-400 rounded`}
                    onClick={()=>{setTodit(!toEdit)}}
                  />
                  
                )}

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
              className={`text-red-600 cursor-pointer ${loading || buyBTN? "hidden" :"" } `} 
              onClick={()=>cartHandler(carrito,"delete",nombre)}
            />
    
            
            <FaPlus
              size={40}
              className={`text-green-600 cursor-pointer ${loading || buyBTN? "hidden" :"" } `}
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
              className="max-w-full max-h-[90vh] rounded"
              src={img || '/logoApp.png'}
              alt={`${nombre}` || 'Logo de la app'}
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

