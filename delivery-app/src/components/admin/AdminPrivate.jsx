import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLoginContext } from "../../context/LoginContext";





export default function AdminPrivate(){


    const {userInfo} = useLoginContext()

    return userInfo.rol === 'admin' ? <Outlet/> : null
}



