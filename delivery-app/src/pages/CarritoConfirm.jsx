import { useShoppingContext } from "../context/ShoppingContext"






export default function CarritoConfirm(){

    const {carrito} = useShoppingContext()

    return(
        <div className="flex flex-col min-h-screen items-center  text-black">

            {carrito.map((item,index)=>(
                <div key={index} className="flex flex-row items-center text-center  justify-around w-full bg-white shadow-md rounded-lg p-4 mb-2">
                    
                    {/* Nombre del Producto */}

                    <p className="font-medium text-lg w-1/3 text-start ">{item.nombre}</p>

                    {/* Precio */}
                    <p className="text-gray-700 font-semibold w-1/3">${item.precio}</p>

                    {/* Cantidad (opcional) */}
                    {item.cantidad && (
                        <p className="text-red-600 font-bold w-1/3">x{item.cantidad}</p>
                    )}
                    
                </div>
              
              
            ))}
            <p className="bg-white text-black rounded-lg w-full mt-5 text-center">TOTAL: ${carrito.reduce((acc,curr)=>acc+curr.precio*curr.cantidad,0)} </p>

        </div>
    )
}
