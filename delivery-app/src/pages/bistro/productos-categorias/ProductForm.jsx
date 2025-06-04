import { useState } from 'react';
import axios from 'axios';
import { useLoginContext } from '@context/LoginContext';
import { capitalize } from '../../../utils/capitalize';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa6';

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);


  const {userInfo,renderORLocalURL}=useLoginContext()

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(loading)
    const formData = new FormData();
    formData.append('imagen', e.target.imagen.files[0]);
    formData.append('nombre', e.target.nombreProducto.value.toLowerCase().trim());
    formData.append('descripcion', e.target.descripcion.value.trim());
    formData.append('categoria', e.target.categoria.value);
    formData.append('precio', e.target.precio.value.trim());
    formData.append('disponible', e.target.disponible.value);

   
    await axios.post(`${renderORLocalURL}/uploadProduct/${userInfo.id}`, formData, 
      {withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      }).then(res => {
        toast.success(`${res.data.message}`)
        e.target.reset()
        setPreview(null)
        setLoading(false)

      }).catch(error=>{
        toast.error(`${error.data.errorMessage}`)
        setLoading(false)
      })
        
  
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
    <div className='flex justify-center min-h-screen'>

      <form
      onSubmit={handleUpload}
      className="w-[90%] md:w-[40%]  bg-white border-2 border-red-700 shadow-md rounded-2xl p-8 flex flex-col  gap-6 text-black "
      >
          <h2 className="text-2xl font-bold text-center text-red-700">Agregar nuevo producto</h2>
              
              <span className='w-full h-[1px] bg-black' />
              <div className='flex flex-row justify-between'>

                  <input
                      type="file"
                      name="imagen"
                      accept="image/*"
                      onChange={handleImageChange}
                      className=" border p-2 rounded-md   file:text-red-700 hover:file:bg-red-100 w-full"
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
              className="border border-red-300 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              required
          />

          <textarea
              name="descripcion"
              placeholder="Descripción del producto"
              rows={4}
              className="border border-red-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              required
          />

          <select
            defaultValue=" "
            name="categoria"
            placeholder="Categoría"
            className="border border-red-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          >
            <option value={""} disabled hidden>Seleccionar categoria</option>
            {userInfo.categorias?.map(categoria=>{
              return(
                <option value={categoria}>{capitalize(categoria)}</option>
              )
            })}

          </select>

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
              className={`bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-all cursor-pointer ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
          >
                {loading ? (
                  <div className='flex flex-col justify-center items-center'>
                    <FaSpinner className="animate-spin" />
                    <p>Guardando...</p>
                  </div>
                ) : (
                  'Guardar producto'
                )}
          </button>
      </form>
    </div>

  );
}
