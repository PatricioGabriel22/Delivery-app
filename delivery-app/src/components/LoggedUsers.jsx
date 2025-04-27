import { Fragment, useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { ccapitalizer_3000 } from "../utils/capitalize";





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

            <div className="flex flex-col w-70 md:w-[30%]  bg-gray-200 text-black rounded h-60 overflow-x-hidden">
                <h3 className="text-center font-extrabold text-xl p-1 mb-2">Usuarios en la tienda</h3>


                <div  className="flex flex-col  items-center p-1 ">
                    {loggedUsers.length >0 && loggedUsers?.map((user,index)=>(
                        <div className=" bg-green-200 flex flex-row w-full items-center rounded h-9 md:h-12 border-1 my-1 hover:bg-white cursor-pointer" key={index}>
                            <span className="bg-green-600 rounded-full w-4 h-4 p-2 mx-1 border-2"/>
                            <p className="w-2/3">{ccapitalizer_3000(user.username)}</p>
                            <p className="w-3/3 text-end pr-2 overflow-hidden text-ellipsis whitespace-nowrap">{ccapitalizer_3000(user.localidad)}</p>
                        </div>
                        ))}
                </div>

            </div>

        </Fragment>
    )
}


