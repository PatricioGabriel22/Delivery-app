import { Fragment } from 'react'
import {Route, Routes } from 'react-router-dom'


import AdminPrivate from '@components/admin/AdminPrivate.jsx'
import PreOrderManagement from '@pages/admin/ordenes/PreOrderManagement.jsx'
import EstadisticasDeVentas from '@pages/admin/ordenes/EstadisticasDeVentas.jsx'

import ProductForm from '@pages/admin/productos-categorias/ProductForm.jsx'
import CategoryFrom from '@pages/admin/productos-categorias/CategoryFrom.jsx'

import Home from '@pages/common/Home.jsx'
import Login from '@pages/common/Login'
import Register from '@pages/common/Register.jsx'
import Profile from '@pages/common/Profile.jsx'
import OrdersHistory from '@pages/common/OrdersHistory.jsx'
import LoginProtected from '@components/common/LoginProtected.jsx'
import BackArrow from '@components/common/BackArrow.jsx'


import CarritoConfirm from '@pages/user/CarritoConfirm.jsx'
import SelectPayment from '@pages/user/SelectPayment.jsx'
import PagoConfirmadoPage from '@pages/user/PagoConfirmadoPage.jsx'




function App() {

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     // Mostrar el mensaje de alerta
  //     event.preventDefault()
  //     console.log(event)
  //     confirm("¡Estás a punto de actualizar o salir de la página!");
      
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [])





  return (
    <Fragment>
      <div className='bg-black min-h-screen  text-white  select-none'>
        <BackArrow/>
        <Routes>
          
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>


          <Route element={<LoginProtected/>}>

            <Route path="/" element={<Home/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/carrito" element={<CarritoConfirm/>}/>
            <Route path="/comprar" element={<SelectPayment/>}/>

            <Route path='/pago-confirmado' element={<PagoConfirmadoPage/>} />


            <Route element={<AdminPrivate/>}>
              
              <Route path="/OrdersHistory" element={<OrdersHistory/>}/>
              <Route path='/estadisticas' element={<EstadisticasDeVentas/>} />

              <Route path="/PreOrderManagement" element={<PreOrderManagement/>}/>
              <Route path="/addProduct" element={<ProductForm/>}/>
              <Route path="/addCategory" element={<CategoryFrom/>}/>




            </Route>
            
          </Route>



          
        </Routes>
      

      </div>
    </Fragment>
  )
}

export default App
