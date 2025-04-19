/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLoginContext } from "../context/LoginContext";





export default function PrivateRoute(){

     const {getOrdersAllOrdersData} = useLoginContext()

    const isAuth = sessionStorage.getItem('auth') === 'true'
    
    useEffect(()=>{
        if(isAuth){

            getOrdersAllOrdersData()
        }
    
    },[isAuth])
    


    
    return isAuth ? <Outlet /> : <Navigate to="/login" />
}