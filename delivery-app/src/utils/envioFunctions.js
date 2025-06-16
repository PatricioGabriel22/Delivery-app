


export function decidirCostoEnvio(formaEntrega,zonasDeliveryLocal,localidadUser){

    let costoEnvio = 0
    

    if(formaEntrega === 'Envio'){

        for(let i = 0; i<zonasDeliveryLocal.length ;i++){
    
            if(zonasDeliveryLocal[i].zona.toLowerCase() === localidadUser.toLowerCase()){
                costoEnvio = zonasDeliveryLocal[i].precio
                return costoEnvio
            }
    
    
        }
    }

    if(formaEntrega !== 'Envio') return costoEnvio

   
}