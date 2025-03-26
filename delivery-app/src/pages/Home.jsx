import { useState } from 'react';
import Nav from "../components/Nav";
import marineras from '../assets/marineras.jpg';

import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function Home() {
  // Estado para controlar si el modal está abierto
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen items-center">
      <h1 className="p-6">Victorina a domicilio!</h1>

      <div className="w-full sm:w-96 flex flex-col bg-white text-black rounded m-5">
        <p className="text-center rounded-t-2xl p-2">Marineras clásicas</p>
        <span className="bg-red-600 h-[1px]" />

        <div className="flex flex-row p-4 gap-x-3">
          <div className="flex flex-col justify-between">
            <span>Marineras ideales para untar con variedad de aderezos</span>
            <p className="self-center font-medium">$3200</p>
          </div>

          {/* Imagen pequeña que abre el modal */}
          <img
            src={marineras}
            className="w-32 h-32 rounded cursor-pointer"
            onClick={openModal} // Abre el modal al hacer clic en la imagen
            alt="Marineras"
          />
        </div>

        <div className="self-center flex flex-row gap-x-10">
          <MdDelete size={40} className="text-red-600 cursor-pointer" />
          <FaPlus size={40} className="text-green-600 cursor-pointer" />
        </div>
      </div>

      {/* Modal para la imagen grande */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}> 

          <div
            className="bg-white p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()} >// Previene que el clic en la imagen cierre el modal
          
            <img
              src={marineras}
              className="max-w-full max-h-[90vh] rounded"
              alt="Marineras"/>

            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-red-500 rounded p-4">
              X
            </button>
          </div>
        </div>
      )}

      <Nav />
    </div>
  );
}
