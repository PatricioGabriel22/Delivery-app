import { Link } from "react-router-dom";
import { useShoppingContext } from "../context/ShoppingContext";
import LogoutBTN from "./LogoutBTN";
import { CiShoppingCart } from "react-icons/ci";
import { useState } from "react";

export default function Nav() {

    const {carrito } = useShoppingContext()

    const [showCarritoBTN, setShowCarritoBTN] = useState(false)



  return (
    <div className="mt-auto w-full relative" >
      {/* Contenedor del carrito sobre la barra roja */}
      {showCarritoBTN && carrito !== 0 && (
        <Link to="/carrito" className="flex justify-center items-center w-full ">
            <p className="text-center absolute bottom-26 bg-red-600 p-3 rounded-full transform">Ver carrito</p>
        </Link>
      )}


      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-black rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg border-4 border-red-600">
        <CiShoppingCart size={90} onClick={()=>setShowCarritoBTN(!showCarritoBTN)} />
        <p className="text-sm font-bold">{carrito}</p>
      </div>

      {/* Barra de navegación */}
      <div className="flex flex-row bg-red-600 justify-between items-center md:justify-evenly rounded-t-4xl w-full p-5">
        <h1>Profile</h1>
        <LogoutBTN />
      </div>
    </div>
  );
}
