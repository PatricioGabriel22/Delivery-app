import LogoutBTN from "./LogoutBTN";
import { CiShoppingCart } from "react-icons/ci";


export default function Nav(){
    return (
        <div className="flex flex-col justify-center items-center mt-auto min-w-screen ">
          
            <div className="flex flex-row bg-red-600 justify-between md:justify-evenly p-4 rounded-t-4xl w-full">
                <h1>Profile</h1>
                <div className="text-black bg-white rounded-3xl absolute bottom-1 flex flex-col items-center justify-center">
                    <CiShoppingCart size={90} />
                    <p className="text-black ">1</p>
                </div> 
                <LogoutBTN />
            </div>

        </div>
      );
    }