import { Fragment } from "react"




export default function LogoutBTN(){



    return(
        <Fragment>


            <button 
                className="cursor-pointer rounded bg-black "
                onClick={()=>{
                sessionStorage.removeItem('auth')
                window.location.reload()
                }}
            >
                Cerrar sesion
            </button>



        </Fragment>
    )
}