import { useShoppingContext } from "../context/ShoppingContext"






export default function CarritoConfirm(){

    const {carrito} = useShoppingContext()

    return(
        <div className="flex flex-col min-h-screen items-center text-white">

            {carrito.map((item,index)=>(
                
                <div className="flex flex-row gap-x-10">
                    <p key={index}>{item.nombre}</p>
                    <p key={index}>{item.precio}</p>

                </div>
              
              
            ))}
            <p>total </p>

        </div>
    )
}
