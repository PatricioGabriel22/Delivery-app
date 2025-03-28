import { Link } from "react-router-dom";
import axios from "axios";
// import { useState } from "react";
import { useLoginContext } from "../context/LoginContext";




export default function Register(){


    const CAMPOS_REGISTRO = ['Nombre de usuario','Contraseña','Confirmar Contraseña','Email','Direccion',"Localidad","Entre calles o esquina",'Telefono']

    const {renderORLocalURL} =  useLoginContext()


    function handleRegister(e){
        e.preventDefault()
       
        const password = e.target[1].value
        const confirmPassword = e.target[2].value

        const registerData = {
            username:e.target[0].value.toLowerCase(),
            password:e.target[1].value,
            email:e.target[3].value.toLowerCase(),
            direccion:e.target[4].value.toLowerCase(),
            localidad:e.target[5].value.toLowerCase(),
            entreCalles:e.target[6].value.toLowerCase(),
            telefono:e.target[7].value
        }



        console.log(registerData)

        if(confirmPassword !== password){
            alert('Las contraseñas no coinciden')
            return
        }

        axios.post(`${renderORLocalURL}/register`, registerData,{withCredentials:true})
        .then(res=>{
            if(res.status === 200){
                console.log(res.data)
                sessionStorage.setItem('auth','true')
                // navigate('/')
            }

        })



        .catch(e=>{
          console.log(e)
        })
    } 


    return(    
    <div className="min-h-screen flex flex-col items-center justify-center">

        <img src='/vite.png' className="w-20"/> 

        <form className="w-80 h-fit border-4 rounded-2xl border-red-600 p-5 flex flex-col items-center " onSubmit={(e)=>handleRegister(e)}>
            {CAMPOS_REGISTRO.map((campo,index)=>(

                <input kye={index} placeholder={campo} type={campo.includes('Contraseña')? 'password' : 'text'}  
                 className="bg-white text-black rounded w-full m-1 p-1 text-lg"/>
            ))}

            <button 
                type="submit" 
                className="bg-red-500 w-full m-5 p-2 rounded-full"
            >Register</button>


        </form>

        <Link to="/login" className="mt-19">Login</Link>


  </div>
  )
}