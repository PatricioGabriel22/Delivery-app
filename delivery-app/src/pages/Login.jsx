import axios from "axios"
import { Fragment, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLoginContext } from "../context/LoginContext"




export default function Login(){

  const [logginIn,setLogginIn] = useState(false)
  const navigate = useNavigate()

  const {renderORLocalURL} = useLoginContext()


  function handleLogin(e){
        e.preventDefault()

        console.log(e)
        axios.post(`${renderORLocalURL}/login`, {
          username:e.target[0].value,
          password:e.target[1].value,

        },{withCredentials:true})
        .then(res=>{
            if(res.status === 200){
                setLogginIn(true)
                console.log(res.data)
                sessionStorage.setItem('auth','true')
                navigate('/')
            }

        })



        .catch(e=>console.log(e))
    } 
    





    return (
      <Fragment>
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
          <img src='/vite.png' className={`w-20 ${logginIn?  'animate-bounce' : ""}`}/>
          <form className=" w-80 border-4 rounded-2xl border-red-600 p-5 flex flex-col" onSubmit={(e)=>handleLogin(e)}>

            <input placeholder="nombre de usuario" type="text" />
            <input placeholder="contraseña" type="password" />

            <button type="submit" >Login</button>


          </form>
          <Link to="/register" className="pt-4">Register</Link>


        </div>

      </Fragment>
    )
  
}