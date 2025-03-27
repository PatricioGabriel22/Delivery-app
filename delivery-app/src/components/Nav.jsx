import LogoutBTN from "./LogoutBTN";
import { CiShoppingCart } from "react-icons/ci";


export default function Nav(){
    return (
        <div className="flex flex-col justify-center items-center mt-auto min-w-screen ">
          
            <CiShoppingCart size={90} className="text-black bg-white rounded-full absolute bottom-5 "/>
            <p className="text-black text-6xl ">10</p>
             
            <div className="flex flex-row bg-red-600 justify-between md:justify-evenly p-4 rounded-t-4xl w-full">
                <h1>Profile</h1>
                <LogoutBTN />
            </div>

        </div>
      );
    }