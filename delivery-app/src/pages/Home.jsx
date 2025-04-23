/* eslint-disable react-hooks/exhaustive-deps */
// import {useState } from 'react';
import Nav from "../components/Nav";
import Card from "../components/Card";
// import { useLoginContext } from "../context/LoginContext";

import { ListaProductos } from "../utils/productos.js";

import { useShoppingContext } from "../context/ShoppingContext.jsx";
import { Fragment, useEffect, useState } from "react";


import victorinaLogo from '../assets/victorina-logo.jpg'
import SearchingBar from "../components/SearchingBar.jsx";
import { useLoginContext } from "../context/LoginContext.jsx";
import { useSocketContext } from "../context/SocketContext.jsx";

ListaProductos.forEach(producto=>producto.cantidad = 0)


export default function Home() {

  const {socket} = useSocketContext()
  const {carrito} = useShoppingContext()
  const {userInfo} = useLoginContext()


  const [productoBuscado,setProductoBuscado] = useState('')

  
  
  const CategoriasProductos = [...new Set(ListaProductos.map(p => p.categoria))];
  
  const [showItems,setShowItems] = useState({
    salados:false,
    dulces:false,
    panificados:false
  })

  //aca me tengo que traer los productos, y cipiarlos para evitar volver a llamar a la db

  //const usuariosLocal = structuredClone(usuariosDesdeDB);

  //   const response = await axios.get('/api/usuarios');
  // const usuariosDesdeDB = response.data;

  // // Copia profunda (independiente)
  // const usuariosLocal = JSON.parse(JSON.stringify(usuariosDesdeDB));

  

  useEffect(()=>{

    socket.on('AlterProductStatus',(data)=>{
      ListaProductos.map(item => {
        
        
        if(item.id  === data.target.id){
          return {...item,...data.target} //fusion de objetos con spred operatos con prioridad en el segundo objeto que llega a sobreescribir
        } else{
          return {...item} //sino retorno el item normal
        } 
      
      })
    })



    return ()=>{
      socket.off('AlterProductStatus')


    }

  },[])





  return (
    <div className="flex flex-col min-h-screen items-center">
      <div className=" mt-3">
        <img src={victorinaLogo} className="w-96 "/>  
      </div>
      

      <SearchingBar searchSetter={setProductoBuscado}/>



      {CategoriasProductos.map(categoria=>{
        
        return(
          <Fragment>

            <h2 
              className="bg-white text-black m-4 flex flex-col  w-full md:w-[90%] rounded-xl font-extrabold text-4xl text-center"
              onClick={()=>setShowItems(prev=>({...prev,[categoria]:!prev[categoria]}))}>
                {/* //manejo el cambio de categoria de forma dinamica con [categoria]
                // sino tendria que poner panaderia:!prev.panaderya...y asi para todo */}
              {categoria}
            </h2>

            

            {(showItems[categoria] || productoBuscado) && (

              <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center p-4">

                {ListaProductos
                  .filter(item=>item.nombre.toLowerCase().includes(productoBuscado))
                  .filter(producto => userInfo.rol === "cliente"  ? producto.disponible : producto)
                  .map((producto,index)=>{
      
                  const target = carrito.find(itemCarrito=> itemCarrito.nombre === producto.nombre) || null
      
                  if(producto.categoria === categoria){
                    
                    return (
                      <Fragment>
      
                        <Card key={index} 
                        id={producto.id}
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


      {/* {ListaProductos
      .filter(item=>item.nombre.toLowerCase().includes(productoBuscado))
      .filter(producto => producto.disponible)
      .map((producto, index) =>{

        const target = carrito.find(itemCarrito=> itemCarrito.nombre === producto.nombre) || null

        if(CategoriasProductos.find(categoria=>categoria === producto.categoria)){

          
          return (
            <Fragment>

              <Card key={index} 
              id={producto.id}
              nombre={producto.nombre} 
              precio={producto.precio} 
              cantidadAdquirida={target === null ? 0 : target.cantidad}
              descripcion={producto.descripcion}
              />
            </Fragment>
          )} 
        }
        

      )} */}
      
      <div className="mt-20 w-full h-3"/>
      <Nav />
    </div>
  );
}
