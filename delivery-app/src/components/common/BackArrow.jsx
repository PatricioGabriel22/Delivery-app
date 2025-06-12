import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"



export default function BackArrow(){

    const location = useLocation();
    const navigate = useNavigate();

    const hideOnRoutes = ["/", "/login","/bistros"]

    if (hideOnRoutes.includes(location.pathname)) return null

    //se necesita que esta con absolute para que funciones bien

    return(
        <button className="text-start cursor-pointer relative " onClick={()=>navigate(-1)}>
            <IoArrowBack size={30}  className="absoltue"/>
        </button>
    )
}