
import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";






export default function LoginProtected(){

  // const {getAllPreOrdersData} = useLoginContext()
  

  const isAuth = sessionStorage.getItem('auth') === 'true'
  

    


    
  return isAuth ? <Outlet /> : <Navigate to="/login" />
}