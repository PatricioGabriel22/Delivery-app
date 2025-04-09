import { useRef } from "react";

export default function ModalConDialog() {
  const dialogRef = useRef(null);

  const abrirModal = () => {
    dialogRef.current.showModal(); // Abre el modal
  };

  const cerrarModal = () => {
    dialogRef.current.close(); // Cierra el modal
  };

  return (
    <div className="p-4">
      <button
        onClick={abrirModal}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Abrir Modal
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-xl p-6 shadow-xl w-[90%] max-w-md backdrop:bg-black/50"
      >
        <h2 className="text-xl font-bold mb-4">Título del Modal</h2>
        <p className="mb-4">Este es el contenido del modal con dialog.</p>

        <button
          onClick={cerrarModal}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </dialog>
    </div>
  );
}
