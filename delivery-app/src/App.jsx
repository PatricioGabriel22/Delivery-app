import { Fragment, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home.jsx'
import Login from './pages/Login'
import Register from './pages/Register.jsx'
import CarritoConfirm from './pages/CarritoConfirm.jsx'
import CheckDataAndBuy from './pages/CheckDataAndBuy.jsx'
import AdminPrivate from './components/AdminPrivate.jsx'
import PreOrderManagement from './pages/PreOrderManagement.jsx'
import Profile from './pages/Profile.jsx'
import ProductForm from './components/ProductForm.jsx'

function App() {


    useEffect(() => {
      const handleBeforeUnload = (event) => {
        // Mostrar el mensaje de alerta
        event.preventDefault()
        console.log(event)
        confirm("¡Estás a punto de actualizar o salir de la página!");
        
      };
  
      window.addEventListener("beforeunload", handleBeforeUnload);
  
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, [])
  


  return (
    <Fragment>
      <div className='bg-black min-h-screen text-white cursor-pointer select-none'>
      <BrowserRouter>
        <Routes>
          
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>


          <Route element={<PrivateRoute/>}>

            <Route path="/" element={<Home/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/carrito" element={<CarritoConfirm/>}/>
            <Route path="/confirmar-direccion-y-comprar" element={<CheckDataAndBuy/>}/>

            <Route element={<AdminPrivate/>}>
              <Route path="/PreOrderManagement" element={<PreOrderManagement/>}/>
              <Route path="/CreateAndEditProduct" element={<ProductForm/>}/>

            </Route>
            
          </Route>



          
        </Routes>
      </BrowserRouter>

      </div>
    </Fragment>
  )
}

export default App
