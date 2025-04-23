/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLoginContext } from "../context/LoginContext";






export default function LoginProtected(){

  const {getAllPreOrdersData,getAllOrdersData} = useLoginContext()
  

  const isAuth = sessionStorage.getItem('auth') === 'true'
  
  useEffect(()=>{


    if(isAuth){
      getAllPreOrdersData()
      getAllOrdersData()
    }

    

  },[isAuth])
    


    
  return isAuth ? <Outlet /> : <Navigate to="/login" />
}