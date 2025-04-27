import { Fragment, useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { capitalize } from "../utils/capitalize";





export default function LoggedUsers(){

    const {loggedUsers} = useSocketContext()



    useEffect(()=>{
        if(loggedUsers.length === 0){
            console.log("Todavia no hay usuarios en la tienda")
        }else{
            console.log(loggedUsers)

        }
    },[loggedUsers])


    return(
        <Fragment>

            <div className="flex flex-col w-70 md:w-[40%]  bg-gray-50 text-black rounded h-60 overflow-x-hidden">
                <h3 className="text-center font-extrabold text-xl">Usuarios en la tienda</h3>

                <div className="w-full flex flex-row p-2">
                    <p className="w-2/3 font-medium">CLIENTE</p>
                    <p className="w-2/3 text-end font-medium">LOCALIDAD</p>

                </div>

                <div  className="flex flex-row  bg-white items-center rounded h-6 border-2 py-1">
                    {loggedUsers.length >0 && loggedUsers?.map((user,index)=>(
                        <Fragment key={index}>
                            <span className="bg-green-600 rounded-full w-4 h-4 p-2 mx-1"/>
                            <p className="w-2/3">{capitalize(user.username)}</p>
                            <p className="w-2/3 text-end pr-2">{capitalize(user.localidad)}</p>
                        </Fragment>
                        ))}
                </div>

            </div>

        </Fragment>
    )
}


