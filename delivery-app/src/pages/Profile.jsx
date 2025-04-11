import { Fragment, useEffect } from "react";


import ProfileCard from "../components/ProfileCard";
import { useLoginContext } from "../context/LoginContext";

import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";



export default function Profile(){

    const {userInfo,allOrdersFromUser} = useLoginContext()
   



    useEffect(()=>{
        console.log(allOrdersFromUser)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    return(
        <Fragment>
            <div className="flex flex-col p-5">

                <Link to={'/'} >
                    <MdArrowBackIosNew size={30} className="mb-5"/>
                </Link>

                <ProfileCard userInfo={userInfo} />

                <div className="flex flex-col p-5 pt-9">
                    <span className="pt-8 pb-8" >PRE-ORDENES EN REVISION</span>
                    <span className="pt-8 pb-8" >Pedidos de {userInfo.username}</span>

                </div>
            </div>
        </Fragment>
    )
}