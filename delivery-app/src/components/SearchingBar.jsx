import { Fragment } from "react";
import { MdContentPasteSearch } from "react-icons/md";





export default function SearchingBar({searchSetter}){
    


    return(
        <Fragment>
            <div className=' flex m-10 rounded-full'>
                
                <input 
                    className='w-full p-2 bg-white text-black rounded-l-full' 
                    type='text' 
                    onChange={(e)=>{searchSetter(e.target.value.toLocaleLowerCase())}}
                    placeholder="Buscar"
                />
                <MdContentPasteSearch size={40} color='black' 
                className='bg-gray-400 rounded-r-full w-24 '/>
            
            </div>
        </Fragment>
    )
}
