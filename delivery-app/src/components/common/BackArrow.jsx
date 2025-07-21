import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"

import { useLoginContext } from '../../context/LoginContext.jsx'
import { GiShop } from "react-icons/gi";


export default function BackArrow(){

      const {userInfo} = useLoginContext()
    
    const location = useLocation()
    const navigate = useNavigate()

    const hideOnRoutes = ["/", "/login","/bistros"]

    if (hideOnRoutes.includes(location.pathname)) return null

    //se necesita que esta con absolute para que funciones bien

    return(
        <div className='flex flex-row justify-between'>

            <button className="text-start cursor-pointer relative " onClick={()=>navigate(-1)}>
                <IoArrowBack size={30}  className="absoltue"/>
            </button>


            {userInfo.rol && (
              <Link to={`/bistros/${userInfo.username}`}>
                <div className="flex flex-row items-center justify-center border-b-2 mr-2 gap-x-2">

                  <GiShop size={20}/>
                  <span>Volver al catalogo</span>
                </div>
              </Link>
          )}
        </div>
    )
}