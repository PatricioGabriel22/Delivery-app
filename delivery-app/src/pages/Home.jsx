/* eslint-disable react-hooks/exhaustive-deps */
// import {useState } from 'react';
import Nav from "../components/Nav";
import Card from "../components/Card";
// import { useLoginContext } from "../context/LoginContext";



import { useShoppingContext } from "../context/ShoppingContext.jsx";
import { Fragment, useEffect, useState } from "react";


import victorinaLogo from '../assets/victorina-logo.jpg'
import SearchingBar from "../components/SearchingBar.jsx";
import { useLoginContext } from "../context/LoginContext.jsx";
import { useSocketContext } from "../context/SocketContext.jsx";

import {ccapitalizer_3000} from '../utils/capitalize.js'

import Loading from "../components/Loading.jsx";
import Error from "../components/Error.jsx";
import { useCatalogContext } from "../context/CatalogContext.jsx";



export default function Home() {
  
  const {socket} = useSocketContext()
  const {carrito} = useShoppingContext()
  const {userInfo} = useLoginContext()
  
  const {catalogoDelAdmin,refresh,isLoading,isError} = useCatalogContext()

  const [productoBuscado,setProductoBuscado] = useState('')



  const CategoriasProductos = [...new Set(catalogoDelAdmin.map(p => p.categoria))]
  
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


    socket.on('productoAgregado',(data)=>{
      refresh(prevData=>{
        //prevData es la data cruda del hook useSWR
        if(!prevData) return

        const newCatalogo = [...prevData.catalogoDelAdmin, data.nuevoProducto]

        return {
          ...prevData,
          catalogoDelAdmin: newCatalogo
        }
      },false)
    })

    socket.on('productoEliminado',(data)=>{

      refresh(prevData=>{
        if(!prevData) return
        const newCatalogo = prevData.catalogoDelAdmin.filter(producto => producto._id !== data.deletedId)

        return {
          ...prevData,
          catalogoDelAdmin: newCatalogo
        }
      },false)

    })


    return ()=>{
      socket.off('AlterProductStatus')
      socket.off('productoAgregado')
      socket.off('productoEliminado')


    }

  },[])





  return (
    <div className="flex flex-col min-h-screen items-center">
      <div className=" mt-3">
        <img src={victorinaLogo} className="w-96 "/>  
      </div>
      


      <SearchingBar searchSetter={setProductoBuscado}/>

      {isLoading &&  (
        <Loading msg={"Cargando catalogo..."} />
      )}

      {isError && (
        <Error msg={"Hubo un error al cargar el catalogo."} />
        
      )}


      {CategoriasProductos.map(categoria=>{
        
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
