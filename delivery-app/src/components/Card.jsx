import { useEffect, useState } from "react";

import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";



import marineras from "../assets/marineras.jpg";
import { useShoppingContext } from "../context/ShoppingContext";

export default function Card() {
  // Estado para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para controlar la cantidad en el carrito
  const {carrito,setCarrito,setTotal } = useShoppingContext()

  useEffect(()=>{
    setTotal(prev=>prev+(carrito*3200))
  },[carrito,setTotal])
 

  return (
    <div className="w-full sm:w-96 flex flex-col bg-white text-black rounded m-5">
      <p className="text-center rounded-t-2xl p-2">Marineras clásicas</p>
      <span className="bg-red-600 h-[1px]" />

      <div className="flex flex-row p-4 gap-x-3">
        <div className="flex flex-col justify-between">
          <span>Marineras ideales para untar con variedad de aderezos</span>
          <p className="self-center font-medium">$3200</p>
        </div>

        {/* Imagen que abre el modal */}
        <img
          src={marineras}
          className="w-32 h-32 rounded cursor-pointer select-none"
          onClick={() => setIsModalOpen(true)}
          alt="Marineras"
        />
      </div>

      <div className="self-center flex flex-row gap-x-10">
        <MdDelete size={40} className="text-red-600 cursor-pointer"  
        onClick={() => {
          
          carrito === 0 ? setCarrito(0) : setCarrito(carrito - 1)
          
        }} />

        
        <FaPlus
          size={40}
          className="text-green-600 cursor-pointer"
          onClick={() => setCarrito(carrito + 1)}
        />
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
