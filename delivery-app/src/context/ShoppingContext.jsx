/* eslint-disable no-unused-vars */
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

    const [carrito, setCarrito] = useState([])
    const [total, setTotal] = useState(0)


    return (
        <shoppingContext.Provider value={{
            carrito,
            setCarrito,
            total,
            setTotal,

        }}>
            {children}
        </shoppingContext.Provider>
    )
}