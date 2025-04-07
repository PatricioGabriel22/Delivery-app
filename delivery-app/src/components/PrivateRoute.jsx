import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";





export default function PrivateRoute(){

   

    const isAuth = sessionStorage.getItem('auth') === 'true'
    
    

    
    return isAuth ? <Outlet /> : <Navigate to="/login" />
}