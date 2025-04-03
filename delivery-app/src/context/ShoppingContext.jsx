// /* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react"



const shoppingContext = createContext()

export const useShoppingContext = () => {
    const hook = useContext(shoppingContext)
    if (!hook) {
        throw new Error("Este hook se usa dentro de un provider")
    }
    return hook
}




export function ShoppingProvider({ children }) {



    const [carrito, setCarrito] = useState(JSON.parse(sessionStorage.getItem("carrito")) || [])
    const [total, setTotal] = useState(0)

    const [importeTotal,setImporteTotal] = useState(0)
  



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
      

    function cartHandler(cart,action,product,precioProduct){
       const target = cart.find(item=> item.nombre === product)
   
       // if(!target) return
   
       let newCart = cart
   
       console.log(action)
       
       if(action === "add"){
           
           
        if(target){
           newCart = [...cart.filter(item=>item.nombre !== product),{...target,cantidad: target.cantidad+1}]
   
         }else{
           newCart = [...cart,{nombre:product,precio:precioProduct,cantidad:1}]
         }
         
         
       }
      
       
       if(action === "delete"){ 
           if(target.cantidad > 1 ){
           newCart = [...cart.filter(item=>item.nombre !== product),{...target,cantidad: target.cantidad-1}]
           
         }else{
           newCart = [...cart.filter(item=>item.nombre !== product)]
         }
       }
   
   
        
       sessionStorage.setItem('carrito',JSON.stringify(newCart)) //almaceno como texto plano
   
       setCarrito(JSON.parse(sessionStorage.getItem('carrito'))) //recupero y parseo
   
    } 



    return (
        <shoppingContext.Provider value={{
            carrito,
            setCarrito,
            total,
            setTotal,

            importeTotal,
            setImporteTotal,

            cantidadVisualizer,
            cartHandler

        }}>
            {children}
        </shoppingContext.Provider>
    )
}