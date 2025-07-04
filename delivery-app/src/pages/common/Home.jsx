/* eslint-disable react-hooks/exhaustive-deps */

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

import { useBistroContext } from "../../context/BistrosContext.jsx";

import {ccapitalizer_3000} from '../../utils/capitalize.js'

import Loading from "@components/common/Loading.jsx";
import Error from "@components/common/Error.jsx";


import Help from "../user/Help.jsx";
import DeliveryStatus from "../../components/common/DeliveryStatus.jsx";
import { Link, useParams } from "react-router-dom";
import { useCatalogMaker } from "../../context/SWR.js";
import ConnectMP from "../../components/bistro/ConnectMP.jsx";
import TiendaStatus from "../../components/common/TiendaStatus.jsx";
import { useSocketContext } from "../../context/SocketContext.jsx";



export default function Home() {
  

  const {bistroName} = useParams()
  const {socket} = useSocketContext()
  

  const {userInfo,renderORLocalURL} = useLoginContext()
  const {carrito} = useShoppingContext()
  const {checkOwnershipAndContinue,bistroInfo} = useBistroContext()
  
  const {catalogoDelBistro,isLoading,isError} = useCatalogMaker(renderORLocalURL, bistroInfo._id || userInfo._id)
  

  const [productoBuscado,setProductoBuscado] = useState('')


  const CategoriasProductos = [...new Set(catalogoDelBistro.map(p => p.categoria))].sort()
  
  const [showItems,setShowItems] = useState({})



  useEffect(()=>{

    if(userInfo.rol){

      checkOwnershipAndContinue({userData:userInfo,param:bistroName})
    }

  },[checkOwnershipAndContinue,userInfo,bistroName])


  useEffect(() => {
    const APP_VERSION = "2.0.1";
    const storedVersion = localStorage.getItem("appVersion");

    if (storedVersion !== APP_VERSION) {
      localStorage.clear();
      localStorage.setItem("appVersion", APP_VERSION);
      
      // ⚠️ Este setTimeout evita que el reload ocurra antes de que se guarde la nueva versión
      setTimeout(() => {
        window.location.reload();
      }, 100); 
    }
  }, [])


  useEffect(()=>{
    if (!userInfo.rol){

      socket.emit('mirandoTienda', {
        userID:userInfo._id,
        bistroID:bistroInfo._id,
        mirando:true
      })

    }

    return () => {
      if(!userInfo.rol){

        socket.emit("mirandoTienda", {
            userID: userInfo._id,
            bistroID: bistroInfo._id,
            mirando: false
        })
      }
    }

  },[userInfo,bistroInfo])


  return (
    <div className="flex flex-col min-h-screen items-center">
      
      <Help />
      <div className="w-full flex flex-col  gap-5 items-center mt-10">
        {userInfo.rol && <ConnectMP/>}
        <div className="flex flex-row gap-x-10">
          <TiendaStatus/>
          <DeliveryStatus rol={userInfo.rol}/>
        </div>
      </div>

      <div className=" flex flex-col items-center text-center mt-10 ">
        {(!userInfo?.img && !bistroInfo?.img) ? (
          <Fragment>
            <h2 className="font-semibold text-2xl">{userInfo.rol ? userInfo.username : bistroInfo.username }</h2>
            <img src="/logoApp.png" width={300} className="h-55 object-cover" />
          </Fragment>
        ) : (
          <img src={userInfo?.img || bistroInfo?.img || "/logoApp.png"} width={350} className="h-55 rounded object-cover" />
        )}
      </div>

     


      {isLoading &&  (
        <Loading msg={"Cargando catalogo..."} />
      )}

      {isError && (
        <Error msg={"Hubo un error al cargar el catalogo."} />
        
      )}





      {CategoriasProductos.length === 0 && userInfo.rol && (
        <div className="w-full  flex flex-col gap-y-3 text-center">

          <p className="text-3xl font-bold text-center">Bienvenido, {userInfo.username}!</p>
          <span className="h-[1px] w-80 bg-red-600 self-center"/>
          <p className="text-lg font-semibold"> Visitá tu perfil para comenzar a agregar productos y poner una linda foto de presentacion. <br></br>
            No te olvides de conectar tu local a Mercado Pago para poder recibir pagos digialtes
          </p>
          
          <Link to={'/profile'}>
            <button className="rounded p-3 bg-red-600 text-white m-3 cursor-pointer">

              Comenzar!
            </button>
          </Link>
        </div>
      )}

      {(!isLoading && !isError) &&  CategoriasProductos.length !== 0  && (
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
                // sino tendria que poner panaderia:!prev.panaderia...y asi para todo */}
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


    </div>
  );
}
