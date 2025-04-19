/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLoginContext } from "../context/LoginContext";





export default function PrivateRoute(){

    const {socket} = useLoginContext()
    const {userInfo,getOrdersAllOrdersData} = useLoginContext()

    const isAuth = sessionStorage.getItem('auth') === 'true'
    
    useEffect(()=>{


        if (socket && userInfo?._id) {
            socket.emit("registerUser", userInfo._id)
        }

        if(isAuth){

            getOrdersAllOrdersData()
        }
    
    },[isAuth])
    


    
    return isAuth ? <Outlet /> : <Navigate to="/login" />
}