import { Fragment } from "react"

import { IoLogOutOutline } from "react-icons/io5";



export default function LogoutBTN(){



    return(
        <Fragment>


            <button 
                className="cursor-pointer rounded bg-black flex flex-col justify-center items-center "
                onClick={()=>{
                    localStorage.clear()
                    localStorage.clear()
                    window.location.reload()
                }}
            >
                <IoLogOutOutline size={20} />
                Cerrar sesion
            </button>



        </Fragment>
    )
}