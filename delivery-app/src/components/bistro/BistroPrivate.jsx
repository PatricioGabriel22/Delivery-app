import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLoginContext } from "@context/LoginContext";





export default function BistroPrivate(){


    const {userInfo} = useLoginContext()

    return userInfo.rol === 'bistro' ? <Outlet/> : null
}



