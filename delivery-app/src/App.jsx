import { Fragment } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home.jsx'
import Login from './pages/Login'
import Register from './pages/Register.jsx'
import CarritoConfirm from './pages/CarritoConfirm.jsx'

function App() {



  return (
    <Fragment>
      <div className='bg-black min-h-screen text-white cursor-pointer select-none'>
      <BrowserRouter>
        <Routes>
          
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>


          <Route element={<PrivateRoute/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/carrito" element={<CarritoConfirm/>}/>
          </Route>


          
        </Routes>
      </BrowserRouter>

      </div>
    </Fragment>
  )
}

export default App
