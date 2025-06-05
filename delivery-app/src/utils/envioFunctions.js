
export function createSlug(target){
    return target.replace(/\s+/g, '-').toLowerCase()
}

export function navigateToBistro(bistroName,navigate){
        const target = createSlug(bistroName)
        navigate(`/bistros/${target}`)
    }

export function decidirCostoEnvio(formaEntrega,localidad){

    let costoEnvio = 0
    localidad.toLowerCase()
    
    if(formaEntrega === "Envio"){

        if(localidad === "monte grande"){
           costoEnvio = 3500
          
        }

        if(localidad === "luis guillon"){
            costoEnvio = 2500
            
        }

        if(localidad === "otro"){
            return costoEnvio        
        }

    } 

    return costoEnvio
}