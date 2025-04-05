import axios from "axios"
import { Fragment, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLoginContext } from "../context/LoginContext"




export default function Login(){

  const [logginIn,setLogginIn] = useState(false)
  const navigate = useNavigate()

  const {renderORLocalURL,setUserInfo} = useLoginContext()

  const CAMPOS_LOGIN = ['nombre de usuario','contraseña']

  function handleLogin(e){
        e.preventDefault()
        setLogginIn(true)

        console.log(e)
        axios.post(`${renderORLocalURL}/login`, {
          username:e.target[0].value,
          password:e.target[1].value,

        },{withCredentials:true})
        .then(res=>{
            if(res.status === 200){
                sessionStorage.setItem('auth','true')
                sessionStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))

                setUserInfo( JSON.parse(sessionStorage.getItem('userInfo')) )
                

                navigate('/')
            }

        })



        .catch(e=>{
          console.log(e)
          setLogginIn(false)
        })
    } 
    





    return (
      <Fragment>
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
          <img src='/vite.png' className={`w-20 ${logginIn?  'animate-bounce' : ""}`}/>
          <form className=" w-80 h-80 border-4 rounded-2xl border-red-600 p-5 flex flex-col items-center justify-around " onSubmit={(e)=>handleLogin(e)}>
            {CAMPOS_LOGIN.map((campo,index)=>(

              <input kye={index} placeholder={campo} type={campo === 'contraseña' ? 'password' : 'text'}   className="bg-white text-black rounded w-full p-1 text-lg"/>
            ))}
            

            <button type="submit" className="bg-red-500 w-full rounded-full p-2">Login</button>


          </form>
          <Link to="/register" className="pt-4">Register</Link>


        </div>

      </Fragment>
    )
  
}