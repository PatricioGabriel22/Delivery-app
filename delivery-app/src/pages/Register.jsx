import { Link } from "react-router-dom";





export default function Register(){


    const CAMPOS_REGISTRO = ['nombre de usuario','contraseña','confirmar contraseña','email','direccion','telefono']


    

    return(    
    <div className="min-h-screen  flex flex-col items-center justify-center">
        <img src='/vite.png' className="w-20"/>
        <form className="w-80 h-96 border-4 rounded-2xl border-red-600 p-5 flex flex-col items-center " onSubmit={(e)=>console.log(e)}>
        {CAMPOS_REGISTRO.map((campo,index)=>(

            <input kye={index} placeholder={campo} type={campo === 'contraseña' ? 'password' : 'text'}   className="bg-white text-black rounded w-full m-1 p-1 text-lg"/>
        ))}

            <button type="submit" className="bg-red-500 w-full m-5 p-2 rounded-full">Register</button>


        </form>
        <Link to="/login" className="pt-4">Login</Link>


  </div>
  )
}