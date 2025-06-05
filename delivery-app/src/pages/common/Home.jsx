
// import {useState } from 'react';
import Nav from "@components/common/Nav";
import Card from "@components/common/Card";
// import { useLoginContext } from "@context/LoginContext";



import { useShoppingContext } from "@context/ShoppingContext.jsx";
import { Fragment, useState } from "react";


import victorinaLogo from '../../assets/victorina-logo.jpg'
import SearchingBar from "@components/common/SearchingBar.jsx";
import { useLoginContext } from "@context/LoginContext.jsx";
// import { useSocketContext } from "@context/SocketContext.jsx";

import {ccapitalizer_3000} from '../../utils/capitalize.js'

import Loading from "@components/common/Loading.jsx";
import Error from "@components/common/Error.jsx";
import { useCatalogContext } from "@context/CatalogContext.jsx";


import { Navigate,useParams } from "react-router-dom";
import { createSlug } from "../../utils/envioFunctions.js";
import Help from "../user/Help.jsx";
import DeliveryStatus from "../../components/common/DeliveryStatus.jsx";



export default function Home() {
  
  const {bistroName} = useParams()
  // const {socket} = useSocketContext()
  const {carrito} = useShoppingContext()
  const {userInfo} = useLoginContext()
  const {catalogoDelBistro,isLoading,isError} = useCatalogContext()

  const [productoBuscado,setProductoBuscado] = useState('')


  const CategoriasProductos = [...new Set(catalogoDelBistro.map(p => p.categoria))].sort()
  
  const [showItems,setShowItems] = useState({})




  
  const slug = createSlug(userInfo.username)
  if(userInfo.rol && bistroName !== slug) return <Navigate to="/bistros"/>



  //probando nueva version con sensor de cambios en el worker

  return (
    <div className="flex flex-col min-h-screen items-center">
      
      <Help />

      <div className="mt-3">
        <img src={victorinaLogo} className="w-96 "/>  
      </div>

      <div className="w-full flex flex-row justify-center items-center">
        <DeliveryStatus rol={userInfo.rol}/>
        {/*Local abierto o cerrado*/}
      </div>
     


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

                {catalogoDelBistro
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
