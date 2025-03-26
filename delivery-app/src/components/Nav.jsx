import LogoutBTN from "./LogoutBTN";
import { CiShoppingCart } from "react-icons/ci";


export default function Nav(){
    return (
        <div className="flex flex-col justify-center items-center mt-auto min-w-screen">

            {/* Círculo incrustado en la barra roja */}
            <div className="rounded rounded-b-2xl bg-cyan-600 h-20 w-20 absolute bottom-3 flex items-center justify-center">
                <CiShoppingCart size={40} className="text-white "/>
            </div>
          
    
            <div className="flex flex-row bg-red-600 justify-between md:justify-evenly p-4 rounded-t-4xl w-full">
                <h1>Profile</h1>
                <LogoutBTN />
            </div>

        </div>
      );
    }