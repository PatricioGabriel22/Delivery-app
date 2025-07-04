import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'




//--- CREO EL CATALOGO CON BASE EN LAS CATEGORIAS QUE TIENE REGISTRADAS EL ADMIN---
async function getAllCatalogFromBistro(url){

    try {
        
        const res = await axios.get(url, { withCredentials: true })
        return res.data
    } catch (error) {
        console.log(error)
    }

    
}


export function useCatalogMaker(urlAPI, infoID){

    
    const fetchFlag = infoID ? true : false

    
    let targetURL =  fetchFlag ? `${urlAPI}/bringAllCatalog/${infoID}` : null


    const SWRoptions =   {
        revalidateOnFocus: true
    }

    const { data, error, isLoading, mutate } = useSWR(targetURL,getAllCatalogFromBistro,SWRoptions)

  

    return {
        catalogoDelBistro: data?.catalogoDelBistro || [],
        isLoading,
        isError: error,
        refresh: mutate
    };


}

//---ME TRAIGO LAS ORDENES CONFIRMADAS ("PEDIDOS" EN DB)---
async function getAllConfirmedOrdersData(url){

    const res = await axios.get(url, { withCredentials: true })
    return res.data
    
}


export function useHistorialOrdenes(userInfo,url,flagPagination,page, limit){


    let targetURL
    let paginatedURL

    const fetchFlag = userInfo ? true : null 


    if(!flagPagination) targetURL = url

    if(flagPagination){


        if(!userInfo.rol){
            
            paginatedURL = `${fetchFlag ? url : ''}&pagination=${true}&page=${page}&limit=${limit}`;
            targetURL = paginatedURL
                
            
        } else if(userInfo.rol === "bistro"){

            paginatedURL = `${fetchFlag ? url : ''}&pagination=${true}&page=${page}&limit=${limit}`;
            targetURL = paginatedURL
            
        }
        



    }


    const SWRoptions =   {
        // refreshInterval: 1000 * 30, // Actualiza cada 30 segundos
        revalidateOnFocus: true, // Refresca si volvés a la pestaña
        // dedupingInterval: 1000000, // mucho tiempo para evitar refetch en requests iguales
    }

    const { data, error, isLoading, mutate } = useSWR(targetURL,getAllConfirmedOrdersData,SWRoptions)

    return {
        confirmedOrders: data?.allOrders || [],
        isLoading,
        isError: error,
        refreshHistorialOrdenes: mutate,
        totalPages: data?.totalPages || 0
    };
}



//---SECCION ESTADISTICAS DEL ADMIN---

async function getImportesDeVentas(url){
    try {
        const res = await axios.get(url)

        return res.data //clave deolver el res.data espeficiamente para que lo capture el data de useSWR
    } catch (error) {
        console.log(error)
    }
}

export function useCalcularEstadisticasDeVentas(desde,hasta,userInfo,url){

    

    const query = desde && hasta ? `?desde=${desde}&hasta=${hasta}&bistroID=${userInfo._id}`:null

    
    

    const shouldFetch = desde && hasta && userInfo.rol === 'bistro'
    
    const targetURL = shouldFetch ? `${url}/obtenerTodosLosPagos${query}`:null

    const {data,error,isLoading,mutate} = useSWR(targetURL,getImportesDeVentas,{revalidateOnFocus:true})
    
    return{
        importeDelRango: data?.importeDelRango,
        isLoading,
        error,
        refreshSearching:mutate
    }
}


async function getAllBistros(url){

    try {
        const res = await axios.get(url, { withCredentials: true })

        return res.data
        
    } catch (error) {
        console.log(error)
    }

    
}

export function useBistroList(url){

    const targetURL = `${url}/getAllOpenBistros`

    const {data,error,isLoading,mutate} = useSWR(targetURL,getAllBistros,{revalidateOnFocus:false})
    
    return{
        openBistros: data?.openBistros,
        isLoading,
        error,
        refreshopenBistros:mutate
    }
}