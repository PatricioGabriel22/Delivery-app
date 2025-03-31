/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";



import marineras from "../assets/marineras.jpg";
import { useShoppingContext } from "../context/ShoppingContext";

export default function Card({nombre, precio, descripcion}) {
  // Estado para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Estado para controlar la cantidad en el carrito
  const {carrito,setCarrito,setTotal,total } = useShoppingContext()
  const [cantidades,setCantidades] = useState(0)



  return (
    <div className="w-full sm:w-96 flex flex-col bg-white text-black rounded-3xl m-5">
      <p className="text-center rounded-t-2xl p-2 text-xl">{nombre}</p>
      <span className="bg-red-600 h-[1px]" />

      <div className="flex flex-row p-4 gap-x-3">
        <div className="flex flex-col justify-between">
          <span>{descripcion}</span>
          <p className="self-center font-medium text-xl">${precio}</p>
        </div>

        {/* Imagen que abre el modal */}
        <img
          src={marineras}
          className="w-20 h-32 rounded cursor-pointer select-none object-cover"
          onClick={() => setIsModalOpen(true)}
          alt="Marineras"
        />
      </div>

      <div className=" justify-around items-center flex flex-row w-full">
        <MdDelete size={40} className="text-red-600 cursor-pointer"  
        onClick={() => {

          setCantidades(0)
          
          carrito.length === 0 ? setCarrito([]) : setCarrito([...carrito.filter(item=>item.nombre !== nombre)])
         
          setTotal(prev=>{
            const target = carrito.find(item=>item.nombre === nombre )
            let valorDeretorno = prev

            if(target){
              valorDeretorno =  prev - target.cantidad
            }

            return valorDeretorno

          })


        }} />

        
        <FaPlus
          size={40}
          className="text-green-600 cursor-pointer"
          onClick={()=>{
            setCantidades(cantidades+1)
            setCarrito([...carrito.filter(item=>item.nombre !== nombre),{nombre:nombre,precio:precio,img:"foto",cantidad:cantidades+1}])
            setTotal(prev=>prev+1)
          }}
        />
         <span className={`text-3xl self-end ${cantidades === 0? "invisible":"block"}`}>x{cantidades}</span>

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

