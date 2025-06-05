
import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";


export default function LoginProtected() {

  const isAuth = localStorage.getItem('auth') === 'true';

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
}
