// import {useState } from 'react';
import Nav from "../components/Nav";
import Card from "../components/Card";
// import { useLoginContext } from "../context/LoginContext";

import { ListaProductos } from "../utils/productos.js";

import { useShoppingContext } from "../context/ShoppingContext.jsx";



ListaProductos.forEach(producto=>producto.cantidad = 0)


export default function Home() {


  const {carrito} = useShoppingContext()
  // const {renderORLocalURL} = useLoginContext()
  // console.log(renderORLocalURL)




  //aca me tengo que traer los productos

  return (
    <div className="flex flex-col min-h-screen items-center">
      <h1 className="p-6">Victorina a domicilio!</h1>

      {ListaProductos.map((producto, index) =>{

        const target = carrito.find(itemCarrito=> itemCarrito.nombre === producto.nombre) || null

        

        return (<Card key={index} 
          id={producto.id}
          nombre={producto.nombre} 
          precio={producto.precio} 
          cantidadAdquirida={target === null ? 0 : target.cantidad}
          descripcion={producto.descripcion}/>
        )} 

      )}
      
      <div className="mt-20 w-full h-3"/>
      <Nav />
    </div>
  );
}
