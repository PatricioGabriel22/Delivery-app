import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'





async function getAllConfirmedOrdersData(url){

    const res = await axios.get(url, { withCredentials: true })
    return res.data
    
}


export function useConfirmedOrders(userInfo,url,page = 1, limit = 5){

    let targetURL
    const fetchFlag = userInfo ? userInfo?.id : null 

    const withPagination = userInfo.rol === 'admin' ? false : true

    if(withPagination){
        const paginatedURL = `${fetchFlag ? url : ''}&page=${page}&limit=${limit}`;
        targetURL = paginatedURL
    }else{
        targetURL = url
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
