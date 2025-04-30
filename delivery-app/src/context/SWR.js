import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'





async function getAllConfirmedOrdersData(url){

    const res = await axios.get(url, { withCredentials: true })
    return res.data
    
}


export function useConfirmedOrders(userInfo,url,flagPagination,page, limit){


    let targetURL
    let paginatedURL

    const fetchFlag = userInfo ? true : null 


    if(!flagPagination) targetURL = url

    if(flagPagination){


        if(!userInfo.rol){
            
            paginatedURL = `${fetchFlag ? url : ''}&pagination=${true}&page=${page}&limit=${limit}`;
            targetURL = paginatedURL
                
            
        } else if(userInfo.rol === "admin"){

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
        refresh: mutate,
        totalPages: data?.totalPages || 0
      };
}





async function getAllCatalogFromAdmin(url){

    try {
        
        const res = await axios.get(url, { withCredentials: true })
        return res.data
    } catch (error) {
        console.log(error)
    }
    
}


export function useCatalogMaker(urlAPI){

    
    let targetURL = `${urlAPI}/bringAllCatalog/6806b8fe2b72a9697aa59e5f`


    const SWRoptions =   {
        revalidateOnFocus: true
    }

    const { data, error, isLoading, mutate } = useSWR(targetURL,getAllCatalogFromAdmin,SWRoptions)


    return {
        catalogoDelAdmin: data?.catalogoDelAdmin || [],
        isLoading,
        isError: error,
        refresh: mutate
      };


}




