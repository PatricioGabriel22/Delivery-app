import { Link, useLocation, useNavigate } from "react-router-dom";
import { useShoppingContext } from "@context/ShoppingContext";
import LogoutBTN from "./LogoutBTN";
import { CiShoppingCart } from "react-icons/ci";
import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useLoginContext } from "../../context/LoginContext";

import { FaListCheck } from "react-icons/fa6";
import { GiShop } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5"
import { FaUserLarge } from "react-icons/fa6";

import { useBistroContext } from "../../context/BistrosContext";




export default function Nav() {
  const {userInfo} = useLoginContext()
  const {bistroInfo,createSlug} = useBistroContext()
  const { carrito,total,setTotal } = useShoppingContext();
  const [showCarritoBTN, setShowCarritoBTN] = useState(false);
  
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const [locationFlag,setLocationFlag] = useState(location.pathname.includes(`/bistros/${createSlug(bistroInfo.username)}`) || "")

  

  useEffect(() => {
    const carritoLleno = carrito.length > 0;

    if (carritoLleno && location.pathname === "/bistros") {
      Swal.fire({
        icon: "warning",
        title: "Debes vaciar tu carrito",
        text: "Termina la compra actual antes de cambiar de bistró o eliminá todos los items del carrito tocando en editar orden.",
        confirmButtonText: "Entendido",
      }).then(() => {
        navigate("/carrito");
      });
    }

    setLocationFlag(location.pathname.includes(`/bistros/${createSlug(bistroInfo.username)}`))

  }, [location.pathname, carrito,navigate,createSlug,bistroInfo.username])



  useEffect(()=>{
    
    if(carrito.length >= 0){
      setTotal(carrito.reduce((acc,curr)=>acc + curr.cantidad,0))
      localStorage.setItem("total", total);

      
    }



  },[carrito,setTotal,total])
  

  const hideOnRoutes = [ "/login","/register"]

  if (hideOnRoutes.includes(location.pathname)) return null


  return (
    <div className="fixed bottom-0 left-0 w-full z-10 ">
      {/* Contenedor del carrito sobre la barra roja */}
      {showCarritoBTN && carrito.length !== 0 && locationFlag && (

        <Link to="/carrito" className="flex justify-center items-center w-full">
          <p className="text-center absolute bottom-26 bg-red-600 p-3 rounded-full transform">
            Ver carrito
          </p>
        </Link>
 
      )}


      

      {!userInfo.rol && locationFlag && (


        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-black rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg border-4 border-red-600">
          <CiShoppingCart size={90} onClick={() => setShowCarritoBTN(!showCarritoBTN)} />
          <p className="text-sm font-bold">{total}</p>
        </div>
      )}

      {/* Barra de navegación */}
      <div className="flex flex-row bg-red-600 justify-between items-center md:justify-evenly rounded-t-4xl w-full p-5">
        <Link to={"/profile"} >

          <div className="flex flex-col justify-center items-center">
            <FaUserLarge size={20}/>
            <p>Perfil</p>
          </div>

        </Link>

        {!userInfo.rol  && !locationFlag && (
          <Link to={'/bistros'}>

            <div className="flex flex-col items-center justify-center">
              <GiShop size={20} />
              <p>Bistros</p>
            </div>

          </Link>
        )}

        {userInfo.rol && (
          <Fragment>

            <Link to={'/PreOrderManagement'}>
            <div className="flex flex-col items-center">

              <FaListCheck size={20}/>
              <span>Pre-ordenes</span>
            </div>
            </Link>

            <Link to={'/configuraciones'}>
            <div className="flex flex-col items-center">
              <IoSettingsOutline  size={20}/>
              <p>Ajustes</p>
            </div>
            </Link>
          </Fragment>
        )}
        <LogoutBTN />
      </div>
    </div>
  );
}
