import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ShoppingProvider } from './context/ShoppingContext.jsx'

createRoot(document.getElementById('root')).render(
  
  <Fragment>
    <ShoppingProvider>
      <App />

    </ShoppingProvider>
  </Fragment>,
)
