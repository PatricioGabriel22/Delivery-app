/* eslint-disable react-hooks/exhaustive-deps */
// import {useState } from 'react';
import Nav from "@components/common/Nav";
import Card from "@components/common/Card";
// import { useLoginContext } from "@context/LoginContext";



import { useShoppingContext } from "@context/ShoppingContext.jsx";
import { Fragment, useEffect, useState } from "react";


import victorinaLogo from '../../assets/victorina-logo.jpg'
import SearchingBar from "@components/common/SearchingBar.jsx";
import { useLoginContext } from "@context/LoginContext.jsx";
import { useSocketContext } from "@context/SocketContext.jsx";

import {ccapitalizer_3000} from '../../utils/capitalize.js'

import Loading from "@components/common/Loading.jsx";
import Error from "@components/common/Error.jsx";
import { useCatalogContext } from "@context/CatalogContext.jsx";


import { Copy,BadgeHelp  } from "lucide-react"
import axios from "axios";

export default function Home() {
  
  const {socket} = useSocketContext()
  const {carrito} = useShoppingContext()
  const {userInfo,renderORLocalURL} = useLoginContext()
  
  const {catalogoDelAdmin,refresh,isLoading,isError} = useCatalogContext()

  const [productoBuscado,setProductoBuscado] = useState('')



  const CategoriasProductos = [...new Set(catalogoDelAdmin.map(p => p.categoria))].sort()
  
  const [showItems,setShowItems] = useState({})


  useEffect(()=>{

    socket.on('AlterProductStatus', (data) => {
    
      refresh(prevData => {
        if (!prevData) return prevData
    
        const updatedStatuses = prevData.catalogoDelAdmin.map(item => {
          if (item._id === data.target._id) {
            return { ...item, disponible: data.target.disponible }
          }
          return item
        })
  
        return {
          ...prevData,
          catalogoDelAdmin: updatedStatuses
        }
      }, false) // false para evitar revalidar desde el servidor
    })

    socket.on('cardProductoActualizada',(data)=>{
      refresh(prevData=>{
        const updatedArray = prevData.catalogoDelAdmin.map(prevItem=>{

          if(prevItem._id === data._id){
            return {...data}
          }else{
            return{...prevItem}
          }
        })

        return{
          ...prevData,
          catalogoDelAdmin:updatedArray
        }

      })
    })

    socket.on('cambioDeEstadoDelivery',(data)=>{setAuxDelivery(data)})

    return ()=>{
      socket.off('AlterProductStatus')
      socket.off('cardProductoActualizada')
    }

  },[])

  const [help,setHelp] = useState(false)
  const [copiadoIndex, setCopiadoIndex] = useState(null)  
  const numeros = [{id:"Panaderia", telefono:1168080019},{id:"Soporte",telefono:1151278287}]
  const copiarAlPortapapeles = async (num,index) => {
  try {
    await navigator.clipboard.writeText(num);
    setCopiadoIndex(index);
    setTimeout(() => setCopiadoIndex(false), 2000); // Mensaje por 2 seg
  } catch (err) {
    console.error("Error al copiar", err);
  }
  }


  const [auxDelivery,setAuxDelivery] = useState(null)

  async function handleDeliveryStatus(flagChange){
    const payload = {idRestaurant:'6806b8fe2b72a9697aa59e5f'}
    
    try {
      
      
      if(flagChange){
        //Obtengo el estado actual del delivery
        const getRestaurant = await axios.get(`${renderORLocalURL}/getRestaurant/${payload.idRestaurant}`,{withCredentials:true})
        setAuxDelivery(getRestaurant.data.deliveryStatus)
      }else{
        //modifico el estao del delivery consistentemente en DB
        payload.flagDelivery = auxDelivery
        
        const changedStatus = await axios.post(`${renderORLocalURL}/cambiarEstadoDelivery`,payload,{withCredentials:true})
        setAuxDelivery(changedStatus.data.deliveryStatus)
      }
      


    } catch (error) {
      console.log(error)
    }
  }


  useEffect(()=>{handleDeliveryStatus(true)},[])


  return (
    <div className="flex flex-col min-h-screen items-center">

      {help ? (
        <div className="flex flex-col justify-center items-center md:justify-around  md:flex-row w-full relative ">
          <p className="absolute top-0 right-2 p-2 font-bold  text-lg cursor-pointer" onClick={()=>setHelp(!help)}>X</p>

          {numeros.map((numero,index)=>{
            return(
              
            <div className="flex items-center " key={index}>
              <p className="text-center px-2">{numero.id}: </p> 
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
      ) :(<BadgeHelp size={30}  onClick={()=>setHelp(!help)} className="text-blue-600 self-end absolute cursor-pointer m-2"/>)}



      <div className=" mt-3">
        <img src={victorinaLogo} className="w-96 "/>  
      </div>
      <button 
        className={`rounded bg-gray-100 text-black p-3 flex flex-row gap-x-2  ${userInfo.rol? "cursor-pointer":"pointer-events-none"} `}
        onClick={()=>handleDeliveryStatus(false)}
        >
        <span className={`rounded-full p-3 ${auxDelivery ? "bg-green-500":"bg-red-500"}`} />
        <p>{auxDelivery? "Delivery activo":"Sin delivery"}</p>
      </button>      

     


      {isLoading &&  (
        <Loading msg={"Cargando catalogo..."} />
      )}

      {isError && (
        <Error msg={"Hubo un error al cargar el catalogo."} />
        
      )}

      {(!isLoading && !isError) && (
        <Fragment>

          <SearchingBar searchSetter={setProductoBuscado}/>
          <span >🔵🔵⚪☀️⚪🔵🔵</span>

        </Fragment>
        )}


      {(!isLoading && !isError) && CategoriasProductos.map(categoria=>{
        
        return(
          <Fragment>

            <h2 
            
              className="bg-white text-black m-4 flex flex-col  w-full md:w-[90%] rounded-xl font-extrabold text-4xl text-center cursor-pointer"
              onClick={()=>setShowItems(prev=>({...prev,[categoria]:!prev[categoria]}))}>
                {/* //manejo el cambio de categoria de forma dinamica con [categoria]
                // sino tendria que poner panaderia:!prev.panaderya...y asi para todo */}
              {ccapitalizer_3000(categoria)}
            </h2>

            

            {(showItems[categoria] || productoBuscado) && (

              <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center p-4">

                {catalogoDelAdmin
                  .filter(item=>item.nombre.toLowerCase().includes(productoBuscado))
                  .filter(producto => !userInfo.rol ? producto.disponible : producto)
                  .map((producto,index)=>{
      
                    const target = carrito.find(itemCarrito=> itemCarrito.nombre === producto.nombre.trim()) || null

                 
                    if(producto.categoria === categoria){
                      
                      return (
                        <Fragment>
        
                          <Card key={index} 
                          id={producto._id}
                          nombre={producto.nombre} 
                          precio={producto.precio} 
                          cantidadAdquirida={target === null ? 0 : target.cantidad}
                          descripcion={producto.descripcion}
                          disponible={producto.disponible}
                          img={producto.img}

                          />
        
                        </Fragment>
                      )
                  }
        
                  
                })}
              </div>
            )}

          </Fragment>
          
        )
        

      })}




      <div className="mt-20 w-full h-3"/>
      <Nav />

    </div>
  );
}
