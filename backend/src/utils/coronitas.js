console.log("test para app")


export function precio_producto_en_coronitas(valor,precio_coronita = 1000){
    const porcentaje_de_transformacion = 400
    const precio_aumentado = valor * porcentaje_de_transformacion/100
    const valor_en_coronitas = Math.ceil( precio_aumentado / precio_coronita)
    return valor_en_coronitas
}

export function calcular_coronitas_cliente(valor,precio_coronita = 1000) {
    let respuesta = "No alcanza para sumar coronitas"
    
    

    if(valor >= precio_coronita){
        const coronitas = Math.floor(valor / precio_coronita) 
        respuesta = `Sumaste ${coronitas} coronitas!`
    }
    return respuesta
}


console.log(calcular_coronitas_cliente(24999))

console.log(precio_producto_en_coronitas(5200))