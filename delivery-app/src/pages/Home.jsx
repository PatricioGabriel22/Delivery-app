// import {useState } from 'react';
import Nav from "../components/Nav";
import Card from "../components/Card";
import { useLoginContext } from "../context/LoginContext";
import { useEffect } from "react";

import { ListaProductos } from "../utils/productos.js";


export default function Home() {



  const {renderORLocalURL} = useLoginContext()
  console.log(renderORLocalURL)

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Mostrar el mensaje de alerta
      event.preventDefault()
      console.log(event)
      confirm("¡Estás a punto de actualizar o salir de la página!");
      
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [])



  return (
    <div className="flex flex-col min-h-screen items-center">
      <h1 className="p-6">Victorina a domicilio!</h1>

      {ListaProductos.map((producto, index) =>
         (<Card key={index} 
          keyTarget={index}
          nombre={producto.nombre} 
          precio={producto.precio} 
          descripcion={producto.descripcion}/>
      ))}
      
      
      <Nav />
    </div>
  );
}
