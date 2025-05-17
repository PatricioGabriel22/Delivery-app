import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import { useState } from "react";
import { useLoginContext } from "../context/LoginContext";
import {useState } from "react";
import succesLogo from '../assets/succesLogo.png'
import toast from "react-hot-toast";



export default function Register(){


    const CAMPOS_REGISTRO = ['Nombre de usuario','Contraseña','Confirmar Contraseña','Direccion',"Localidad","Entre calles o esquina",'Telefono']

    const {renderORLocalURL} =  useLoginContext()

    const [succesAnimation, setSuccesAnimation] = useState(false)
    const [errorAnimation, setErrorAnimation] = useState(false)

    const navigate = useNavigate()

    function handleRegister(e){
        e.preventDefault()
        
        const password = e.target[1].value
        const confirmPassword = e.target[2].value

        const registerData = {
            username:e.target[0].value.trim(),
            password:e.target[1].value,
            direccion:e.target[3].value.toLowerCase().trim(),
            localidad:e.target[4].value.toLowerCase(),
            entreCalles:e.target[5].value.toLowerCase().trim(),
            telefono:e.target[6].value.trim()
        }

        

  

        if(confirmPassword !== password){
            toast.error('Las contraseñas no coinciden')
            return
        }

        setSuccesAnimation(true)

        axios.post(`${renderORLocalURL}/register`, registerData,{withCredentials:true})
        .then(res=>{
            if(res.status === 200){
                toast.success(res.data.message)
                localStorage.setItem('auth','true')
                
                setTimeout(()=>{
                    navigate('/login')
                },2000)
            }

        })
        .catch(e=>{
            console.log(e)
            setSuccesAnimation(false)
            setErrorAnimation(true)
            
            setTimeout(()=>{
                setErrorAnimation(false)
            },1000)
        })
    } 


    return(    
    <div className="min-h-screen flex flex-col items-center justify-center">

        <img src={succesAnimation? succesLogo : '/logoApp.png'} 
        
        className={`w-20 ${succesAnimation ? 'animate-bounce': ""} ${errorAnimation ? "animate-[shake_0.4s_ease-in-out]": ""}`}/> 

        <form className="w-80 h-fit border-4 rounded-2xl border-red-600 p-5 flex flex-col items-center " onSubmit={(e)=>handleRegister(e)}>
            {CAMPOS_REGISTRO.map((campo, index) => (
                campo === 'Localidad' ? (
                    <select key={index} className="bg-white text-black rounded w-full m-1 p-1 text-lg" required={true}>
                        <option value="" disabled selected hidden >Seleccione una localidad</option>
                        <option value="monte grande">Monte Grande</option>
                        <option value="luis guillon">Luis Guillón</option>
                    </select>
                ) : (
                    <input
                    key={index}
                    required={true}
                    placeholder={campo}
                    type={campo.includes('Contraseña') ? 'password' : 'text'}
                    className="bg-white text-black rounded w-full m-1 p-1 text-lg"
                    />
                )
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