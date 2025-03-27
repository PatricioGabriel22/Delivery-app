import LogoutBTN from "./LogoutBTN";
import { CiShoppingCart } from "react-icons/ci";


export default function Nav(){
    return (
        <div className="mt-auto min-w-screen ">
          

            <div className="flex flex-row bg-red-600 justify-evenly items-center md:justify-evenly rounded-t-4xl w-full p-4 relative">

                <h1>Profile</h1>

                <div className="text-black bg-white rounded-3xl  flex flex-col items-center justify-center absolute bottom-6">
                    <CiShoppingCart size={60} />
                    <p className="text-black ">10</p>
                </div> 

                <LogoutBTN />
            </div>

        </div>
      );
    }