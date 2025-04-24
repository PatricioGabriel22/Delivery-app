import useSWR from 'swr'
import axios from 'axios'





async function getAllConfirmedOrdersData(url){

    const res = await axios.get(url, { withCredentials: true })
    return res.data
    
}


export function useConfirmedOrders(userInfo,url){
    const fetchFlag = userInfo?.id 

    const { data, error, isLoading, mutate } = useSWR(`${fetchFlag ? url: null}`,getAllConfirmedOrdersData)

    return {
        confirmedOrders: data || [],
        isLoading,
        isError: error,
        refresh: mutate,
      };
}
