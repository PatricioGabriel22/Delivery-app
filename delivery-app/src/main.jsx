import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ShoppingProvider } from '@context/ShoppingContext.jsx'
import { LoginProvider } from '@context/LoginContext.jsx'
import { SocketProvider } from '@context/SocketContext.jsx'
import { OrderProvider } from '@context/OrdersContext.jsx'

import {Toaster} from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { CatalogoProvider } from '@context/CatalogContext.jsx'

createRoot(document.getElementById('root')).render(
  
  <Fragment>

    <BrowserRouter>
      <LoginProvider>
        
        <ShoppingProvider>
          <CatalogoProvider>
          <OrderProvider>
            <SocketProvider>
                

          
              <App />
              <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#fff',
                    color: '#333',
                    borderRadius: '8px',
                    padding: '12px 16px',
                  },
                }}
              />
                

            </SocketProvider>
          </OrderProvider>
          </CatalogoProvider>
        </ShoppingProvider>
      
      </LoginProvider>
    </BrowserRouter>     


  </Fragment>
)
