import { Fragment, useEffect } from 'react'
import {Route, Routes } from 'react-router-dom'


import BistroPrivate from '@components/bistro/BistroPrivate.jsx'
import PreOrderManagement from '@pages/bistro/ordenes/PreOrderManagement.jsx'
import EstadisticasDeVentas from '@pages/bistro/ordenes/EstadisticasDeVentas.jsx'
import OrdersHistory from '@pages/bistro/ordenes/OrdersHistory.jsx'
import ProductForm from '@pages/bistro/productos-categorias/ProductForm.jsx'
import CategoryFrom from '@pages/bistro/productos-categorias/CategoryFrom.jsx'

import Home from '@pages/common/Home.jsx'
import Login from '@pages/common/Login'
import Register from '@pages/common/Register.jsx'
import Profile from '@pages/common/Profile.jsx'
import LoginProtected from '@components/common/LoginProtected.jsx'
import BackArrow from '@components/common/BackArrow.jsx'
import Nav from '@components/common/Nav.jsx'

import { updateSW } from '@components/common/UpdateApp.jsx'


import CarritoConfirm from '@pages/user/CarritoConfirm.jsx'
import SelectPayment from '@pages/user/SelectPayment.jsx'
import PagoConfirmadoPage from '@pages/user/PagoConfirmadoPage.jsx'
import Bistros from '@pages/user/Bistros'
import Configuraciones from '@pages/bistro/Configuraciones'





function App() {

  useEffect(()=>{updateSW()},[])


  useEffect(() => {
    const APP_VERSION = "2.0.1";
    const storedVersion = localStorage.getItem("appVersion");

    if (storedVersion !== APP_VERSION) {
      localStorage.clear();
      localStorage.setItem("appVersion", APP_VERSION);
      
      // ⚠️ Este setTimeout evita que el reload ocurra antes de que se guarde la nueva versión
      setTimeout(() => {
        window.location.reload();
      }, 100); 
    }
  }, []);
  




  return (
    <Fragment>
      <div className='bg-black min-h-screen  text-white  select-none'>
        <BackArrow/>
        <Routes>
          
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>


          <Route element={<LoginProtected/>}>

            <Route path="/" element={<Home/>}/>
            <Route path="/bistros" element={<Bistros/>}/>
            <Route path="/bistros/:bistroName" element={<Home/>}/>


            <Route path="/profile" element={<Profile/>}/>
            <Route path="/carrito" element={<CarritoConfirm/>}/>
            <Route path="/comprar" element={<SelectPayment/>}/>

            <Route path='/pago-confirmado' element={<PagoConfirmadoPage/>} />


            <Route element={<BistroPrivate/>}>
              
              <Route path="/OrdersHistory" element={<OrdersHistory/>}/>
              <Route path='/estadisticas' element={<EstadisticasDeVentas/>} />

              <Route path="/PreOrderManagement" element={<PreOrderManagement/>}/>
              <Route path="/addProduct" element={<ProductForm/>}/>
              <Route path="/addCategory" element={<CategoryFrom/>}/>
              <Route path="/configuraciones" element={<Configuraciones/>}/>





            </Route>
            
          </Route>



          
        </Routes>
      
        <div className="mt-20 w-full h-3"/>
        <Nav />
      </div>
    </Fragment>
  )
}

export default App
