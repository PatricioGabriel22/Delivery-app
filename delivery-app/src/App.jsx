import { Fragment, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home.jsx'
import Login from './pages/Login'
import Register from './pages/Register.jsx'

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
      <div className='bg-black min-h-screen text-white'>
      <BrowserRouter>
        <Routes>
          
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>


          <Route element={<PrivateRoute/>}>
          
          
          </Route>

          <Route path="/" element={<Home/>}/>
          
        </Routes>
      </BrowserRouter>

      </div>
    </Fragment>
  )
}

export default App
