// /* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react"

import axios from 'axios'
import {io} from 'socket.io-client'


const shoppingContext = createContext()

export const useShoppingContext = () => {
    const hook = useContext(shoppingContext)
    if (!hook) {
        throw new Error("Este hook se usa dentro de un provider")
    }
    return hook
}




export function ShoppingProvider({ children }) {


  const WSSmanager = import.meta.env.MODE === 'development' ? 'ws://localhost:4000' : 'wss://delivery-app-0lcx.onrender.com'

  const [carrito, setCarrito] = useState(JSON.parse(sessionStorage.getItem("carrito")) || [])
  const [total, setTotal] = useState(0)

  const [importeTotal,setImporteTotal] = useState(0)

  const [buyBTN,setBuyBTN] = useState(JSON.parse(sessionStorage.getItem("buyBTN")) || false)



  const socket = io(WSSmanager,{
    transports:['websocket'],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000
  })


    function cantidadVisualizer(action,arrayPrudctos,nombreProducto){

        const target = arrayPrudctos.find(producto=>producto.nombre === nombreProducto)
      
        
      
        if(action === "add"){
          
          target.cantidad += 1
          console.log(target)
          
        }
      
        
        
        if(action === "delete" && target.cantidad > 0){
          target.cantidad -= 1
          console.log(target)
          
        }
        
      
    }
      

    function cartHandler(cart,action,product){
      const target = cart.find(item=> item.nombre === product)
  
      // armo el carrito solamente con nombre de productos y cantidades
  
      let newCart = cart
  
      console.log(action)
       
      if(action === "add"){
           
          
        if(target){
          newCart = [...cart.filter(item=>item.nombre !== product),{...target,cantidad: target.cantidad+1}]
  
        }else{
          newCart = [...cart,{nombre:product,cantidad:1}]
        }
         
         
      }
      
       
       if(action === "delete"){ 
           if(target.cantidad > 1 ){
           newCart = [...cart.filter(item=>item.nombre !== product),{...target,cantidad: target.cantidad-1}]
           
         }else{
           newCart = [...cart.filter(item=>item.nombre !== product)]
         }
       }
   
   
        
       sessionStorage.setItem('carrito',JSON.stringify(newCart)) //almaceno como string
   
       setCarrito(JSON.parse(sessionStorage.getItem('carrito'))) //recupero y parseo
   
    } 



    async function acceptPreOrder(url,orderInfo){

      const preOrderAcceptedFlag = true
      console.log(orderInfo)
      await axios.post(`${url}/PreOrderManagement`,{orderInfo,preOrderAcceptedFlag},{withCredentials:true})
    }

    async function cancelPreOrder(url,orderInfo,msgDeSugerencia){

      

      const preOrderAcceptedFlag = false
      const idOrden = orderInfo?._id
      await axios.post(`${url}/PreOrderManagement/${idOrden}`,{orderInfo,preOrderAcceptedFlag,msgDeSugerencia},{withCredentials:true})
    }

    
    async function ordenPreparada(url,orderInfo){

      const finishedFlag = true
      const idOrden = orderInfo?._id

      await axios.post(`${url}/PreOrderManagement/${idOrden}`,{finishedFlag},{withCredentials:true})
    }


    async function ordenEntregada(url,orderInfo){

      const deliveredFlag = true
      const idOrden = orderInfo?._id
      console.log(idOrden)
      await axios.post(`${url}/PreOrderManagement/${idOrden}`,{deliveredFlag},{withCredentials:true})
    }








    return (
        <shoppingContext.Provider value={{
            carrito,
            setCarrito,
            total,
            setTotal,

            importeTotal,
            setImporteTotal,

            buyBTN,
            setBuyBTN,
            
            cantidadVisualizer,
            cartHandler,

            socket,
            WSSmanager, 

            acceptPreOrder,
            cancelPreOrder,
            ordenPreparada,
            ordenEntregada


        }}>
            {children}
        </shoppingContext.Provider>
    )
}