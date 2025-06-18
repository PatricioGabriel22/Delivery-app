
// import {useState } from 'react';
import Nav from "@components/common/Nav";
import Card from "@components/common/Card";
// import { useLoginContext } from "@context/LoginContext";



import { useShoppingContext } from "@context/ShoppingContext.jsx";
import { Fragment, useEffect, useState } from "react";


// import victorinaLogo from '../../assets/victorina-logo.jpg'
import SearchingBar from "@components/common/SearchingBar.jsx";
import { useLoginContext } from "@context/LoginContext.jsx";
// import { useSocketContext } from "@context/SocketContext.jsx";
import { useCatalogContext } from "@context/CatalogContext.jsx";
import { useBistroContext } from "../../context/BistrosContext.jsx";

import {ccapitalizer_3000} from '../../utils/capitalize.js'

import Loading from "@components/common/Loading.jsx";
import Error from "@components/common/Error.jsx";


import Help from "../user/Help.jsx";
import DeliveryStatus from "../../components/common/DeliveryStatus.jsx";
import { useParams } from "react-router-dom";



export default function Home() {
  

  const {bistroName} = useParams()

  const {userInfo} = useLoginContext()
  const {carrito} = useShoppingContext()
  const {catalogoDelBistro,isLoading,isError} = useCatalogContext()
  const {checkOwnershipAndContinue,bistroInfo} = useBistroContext()

  const [productoBuscado,setProductoBuscado] = useState('')


  const CategoriasProductos = [...new Set(catalogoDelBistro.map(p => p.categoria))].sort()
  
  const [showItems,setShowItems] = useState({})




  useEffect(()=>{

    if(userInfo.rol){

      checkOwnershipAndContinue({userData:userInfo,param:bistroName})
    }

  },[checkOwnershipAndContinue,userInfo,bistroName])






  //probando nueva version con sensor de cambios en el worker

  return (
    <div className="flex flex-col min-h-screen items-center">
      
      <Help />

      <div className=" flex flex-col items-center text-center mt-10">
        {(!userInfo?.img && !bistroInfo?.img) ? (
          <Fragment>
            <h2 className="font-semibold text-2xl">{userInfo.rol ? userInfo.username : bistroInfo.username }</h2>
            <img src="/logoApp.png" width={300} className="h-55 object-cover" />
          </Fragment>
        ) : (
          <img src={userInfo?.img || bistroInfo?.img} width={350} className="h-55 rounded object-cover" />
        )}
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


      {(!isLoading && !isError) && CategoriasProductos.map((categoria,index)=>{
        
        return(
          <Fragment key={index}>

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
                        <Fragment key={index}>
        
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
