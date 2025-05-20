import { Fragment } from "react";


import { BiShow } from "react-icons/bi";






export default function ShowPassword({setFalg,flagPassword}){




    return(
        <Fragment>
            <span 
              onClick={()=>setFalg(!flagPassword)}
              className={`cursor-pointer p-1 self-end text-center flex flex-row gap-x-2 
              ${flagPassword ? "bg-white rounded  text-black " : "" }`}>

              Ver contraseña

              <BiShow size={30}/>

            </span>
        </Fragment>
    )
}