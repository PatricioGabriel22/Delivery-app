import { Link } from "react-router-dom";





export default function Register(){
return(    
    <div className="min-h-screen  flex flex-col items-center justify-center">
        <img src='/vite.png' className="w-20"/>
        <form className=" w-80 border-4 rounded-2xl border-red-600 p-5 flex flex-col" onSubmit={(e)=>console.log(e)}>

            <input placeholder="nombre de usuario" type="text" />
            <input placeholder="contraseñá" type="password" />
            <input placeholder="confirmar contraseña" type="password" />
            <input placeholder="email" type="email" />
            <input placeholder="direccion" type="text" />
            <input placeholder="telefono" type="number" />

            



            <button type="submit" >Register</button>


        </form>
        <Link to="/login" className="pt-4">Login</Link>


  </div>
  )
}