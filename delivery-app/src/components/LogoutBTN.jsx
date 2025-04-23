import { Fragment } from "react"




export default function LogoutBTN(){



    return(
        <Fragment>


            <button 
                className="cursor-pointer rounded bg-black "
                onClick={()=>{
                    sessionStorage.clear()
                    sessionStorage.clear()
                    window.location.reload()
                }}
            >
                Cerrar sesion
            </button>



        </Fragment>
    )
}