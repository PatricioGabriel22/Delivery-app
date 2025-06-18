import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import { useState } from "react";
import { useLoginContext } from "@context/LoginContext";
import {useState } from "react";
import toast from "react-hot-toast";

import succesLogo from '../../assets/succesLogo.png'
import { IoStorefrontSharp } from "react-icons/io5";
import AsBistro from "../../components/bistro/AsBistro";

export default function Register(){


    const CAMPOS_REGISTRO = ['bistroFlag','Nombre de usuario','Contraseña','Confirmar Contraseña','Direccion',"Localidad","Entre calles o esquina",'Telefono']

    const {renderORLocalURL} =  useLoginContext()

    const [succesAnimation, setSuccesAnimation] = useState(false)
    const [errorAnimation, setErrorAnimation] = useState(false)

  

    const navigate = useNavigate()

    function handleRegister(e){
        e.preventDefault()

  
        
        const password = e.target[2].value
        const confirmPassword = e.target[3].value
        const telefono = e.target[7].value.trim()

        if(confirmPassword !== password){
            toast.error('Las contraseñas no coinciden')
            return
        }

        if(isNaN(telefono)){
            toast.error('El numero de telefono no es valido')
            return
        }

        const registerData = {
            bistroFlag:e.target[0].checked,
            username:e.target[1].value.trim(),
            password: password,
            direccion:e.target[4].value.toLowerCase().trim(),
            localidad:e.target[5].value.toLowerCase().trim(),
            entreCalles:e.target[6].value.toLowerCase().trim(),
            telefono:telefono
        }

        

        console.log(registerData)


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
    <div className=" flex flex-col items-center justify-center">

        <img src={succesAnimation? succesLogo : '/logoApp.png'} 
        className={`w-20 ${succesAnimation ? 'animate-bounce': ""} ${errorAnimation ? "animate-[shake_0.4s_ease-in-out]": ""}`}/> 

        <form className="w-80 h-fit border-4 rounded-2xl border-red-600 p-5 flex flex-col items-center " onSubmit={(e)=>handleRegister(e)}>

 

            {CAMPOS_REGISTRO.map((campo, index) => (
                campo === "bistroFlag" ? (
                    <AsBistro txt={"Voy a registrar mi empresa"} key={index}/>
                ):
                (
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
            >Registrarme</button>


        </form>

        <Link to="/login" className="mt-19">Ingresar a la app</Link>


  </div>
  )
}