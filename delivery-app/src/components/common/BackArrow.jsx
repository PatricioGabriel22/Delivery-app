import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"



export default function BackArrow(){

    const location = useLocation();
    const navigate = useNavigate();

    const hideOnRoutes = ["/", "/login"]

    if (hideOnRoutes.includes(location.pathname)) return null

    return(
        <button className="text-start cursor-pointer relative " onClick={()=>navigate(-1)}>
            <IoArrowBack size={30}  className="absoltue"/>
        </button>
    )
}