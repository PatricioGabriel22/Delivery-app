import axios from "axios"
import { Fragment, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLoginContext } from "@context/LoginContext"

import ShowPassword from "@components/common/ShowPassword.jsx";
import toast from "react-hot-toast";
import InstallPwaBTN from "../../components/user/InstallPwaBTN";
import AsBistro from "../../components/bistro/AsBistro";
import { useBistroContext } from "../../context/BistrosContext";




export default function Login(){

  const [logginIn,setLogginIn] = useState(false)
  const [showPassword,setShowPassword] = useState(false)

  
  const navigate = useNavigate()
  const {renderORLocalURL,setUserInfo} = useLoginContext()
  const {navigateToBistro} = useBistroContext()

  const CAMPOS_LOGIN = ['bistroFlag','Nombre de usuario','Contraseña']

  function handleLogin(e){
    e.preventDefault()
    setLogginIn(true)

    const bistroFlag = e.target[0].checked
    const username = e.target[1].value.trim()
    const password = e.target[2].value.trim()

    if (!username || !password) {
      toast.error("Por favor ingresa usuario y contraseña");
      setLogginIn(false)
      return
    }

    axios.post(`${renderORLocalURL}/login`, {
      bistroFlag,
      username,
      password,

    },{withCredentials:true})
    .then(res=>{
        if(res.status === 200){

          
        
          localStorage.setItem('auth','true')
          localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))

          setUserInfo( JSON.parse(localStorage.getItem('userInfo')) )
          
          if(res.data.userInfo.rol){
            return navigateToBistro(res.data.userInfo.username,navigate)
          }

          navigate('/bistros')
        }

    })
    .catch(e=>{
      console.log(e)
      setLogginIn(false)
    })
  } 
    
  function mostrarContraseñaInput(campo,flagPassword){

    

    if(campo.toLowerCase() !== 'contraseña' || flagPassword && campo.toLowerCase() === 'contraseña') return 'text'

    return 'password'


  }




  return (
      <Fragment>
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
          <img src='/logoApp.png' className={`w-20 ${logginIn?  'animate-bounce' : ""}`} loading="lazy"/>
          <form className=" w-80 h-80 border-4 rounded-2xl border-red-600 p-5 flex flex-col items-center justify-around " 
            onSubmit={(e)=>handleLogin(e)}>


            {CAMPOS_LOGIN.map((campo,index)=>(
              campo === 'bistroFlag' ? (
                <AsBistro txt={"Ingresar como empresa"} key={index}/>
              ):(
                
                <input key={index} 
                  placeholder={campo} 
                  type={mostrarContraseñaInput(campo,showPassword)}   
                  className={` bg-white text-black rounded w-full p-1 text-lg`}/>
                )
              ))}
              <ShowPassword setFalg={setShowPassword} flagPassword={showPassword} />
            



            <button type="submit" className="bg-red-500 w-full rounded-full p-2 cursor-pointer">Ingresar</button>


          </form>


          <Link to="/register" className="pt-4 cursor-pointer">Registrarme</Link>

            <InstallPwaBTN/>
        </div>

      </Fragment>
    )
  
}