// /* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react"

import axios from 'axios'
import toast from "react-hot-toast"




const shoppingContext = createContext()

export const useShoppingContext = () => {
    const hook = useContext(shoppingContext)
    if (!hook) {
        throw new Error("Este hook se usa dentro de un provider")
    }
    return hook
}




export function ShoppingProvider({ children }) {


  const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem("carrito")) || [])
  const [total, setTotal] = useState(0)

  const [importeTotal,setImporteTotal] = useState(0)

  const [loading,setLoading] = useState(JSON.parse(localStorage.getItem('loadingPreOrder')) || false)
  const [buyBTN,setBuyBTN] = useState(JSON.parse(localStorage.getItem("buyBTN")) || false)
  const [responseFromServer,setResponseFromServer] = useState(null)

  




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
  
  
      
      localStorage.setItem('carrito',JSON.stringify(newCart)) //almaceno como string
  
      setCarrito(JSON.parse(localStorage.getItem('carrito'))) //recupero y parseo
  
  } 



  async function orderStatusHandler(url,orderInfo,status,notification){


    const payload = {
      orderInfo,
      status,
      notification
    }


    await axios.post(`${url}/PreOrderManagement/${orderInfo?._id}`,payload,{withCredentials:true})
    .then(res=>{
      console.log(res)
      toast.success(res.data.infoToUser)
    })
    .catch(error=>console.log(error))


  }









  return (
        <shoppingContext.Provider value={{
          carrito,
          setCarrito,
          total,
          setTotal,

          importeTotal,
          setImporteTotal,

          loading,
          setLoading,
          buyBTN,
          setBuyBTN,
          responseFromServer,
          setResponseFromServer,
          
          cantidadVisualizer,
          cartHandler,

          orderStatusHandler


        }}>
            {children}
        </shoppingContext.Provider>
    )
}