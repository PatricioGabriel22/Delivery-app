


export function decidirCostoEnvio(formaEntrega,zonasDeliveryLocal,localidadUser,callbackFuse){

    let costoEnvio = 0
    if(!formaEntrega || !zonasDeliveryLocal || !localidadUser) return costoEnvio
    

    switch(formaEntrega){
        case 'Envio':{

            const resultFuse = callbackFuse('zona',zonasDeliveryLocal,localidadUser)
            console.log(resultFuse)
            if(resultFuse.length > 0){
                costoEnvio = resultFuse[0].item.precio
                return costoEnvio
            }
            
            return costoEnvio
            
        }

      

        case 'Retiro en el local':
            return costoEnvio
        
        default:
            return costoEnvio
    }

   
}