import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ShoppingProvider } from './context/ShoppingContext.jsx'
import { LoginProvider } from './context/LoginContext.jsx'

createRoot(document.getElementById('root')).render(
  
  <Fragment>
    <LoginProvider>
    <ShoppingProvider>
      
      <App />

    </ShoppingProvider>
    </LoginProvider>
  </Fragment>,
)
