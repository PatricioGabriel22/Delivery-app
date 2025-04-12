import { useState } from 'react';
import axios from 'axios';
import { useLoginContext } from '../context/LoginContext';

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);


  const {renderORLocalURL}=useLoginContext()

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('imagen', e.target.imagen.files[0]);
    formData.append('nombre', e.target.nombreProducto.value);
    formData.append('descripcion', e.target.descripcion.value);
    formData.append('categoria', e.target.categoria.value);
    formData.append('precio', e.target.precio.value);
    formData.append('disponible', e.target.disponible.value === 'Disponible');

    try {
      const res = await axios.post(`${renderORLocalURL}/uploadProduct`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Producto subido:', res.data);
      e.target.reset();
      setPreview(null);
    } catch (err) {
      console.error('Error al subir producto:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    
    <form
    onSubmit={handleUpload}
    className="max-w-xl min-h-screen bg-white border-2 border-red-700 shadow-md rounded-2xl p-8 flex flex-col m-auto gap-6 text-black "
    >
        <h2 className="text-2xl font-bold text-center text-red-700">Agregar nuevo producto</h2>
            
            <span className='w-full h-[1px] bg-black' />
            <div className='flex flex-row justify-between'>

                <input
                    type="file"
                    name="imagen"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border p-2 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />

                <button onClick={()=>setPreview(!preview)} className={`text-bold text-2xl ${preview ? "block":"invisible"} `}>X</button>
            </div>


        {preview && (
            <img
            src={preview}
            alt="Previsualización"
            className="w-60 h-auto rounded-xl mx-auto border-2 border-red-700 shadow"
            />
        )}

        <input
            type="text"
            name="nombreProducto"
            placeholder="Nombre del producto"
            className="border border-red-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            required
        />

        <textarea
            name="descripcion"
            placeholder="Descripción del producto"
            rows={4}
            className="border border-red-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            required
        />

        <input
            type="text"
            name="categoria"
            placeholder="Categoría"
            className="border border-red-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            required
        />

        <input
            type="number"
            name="precio"
            placeholder="Precio"
            step="1"
            className="border border-red-300 p-2 w-[35%] self-center rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            required
        />

        <select
            name="disponible"
            className="border border-red-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            required
        >
            <option value={true}>Disponible</option>
            <option value={false}>No disponible</option>
        </select>

        <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-all"
        >
            {loading ? 'Guardando...' : 'Guardar producto'}
        </button>
    </form>

  );
}
