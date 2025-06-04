import { Fragment, useState } from "react";
import { IoStorefrontSharp } from "react-icons/io5";




export default function AsBistro({txt}){

      const [bistroFlag,setBistroFlag] = useState(false)

    return(
        <Fragment>
            <span className={`flex gap-x-2 mb-9 items-center `}>
                <input type="checkbox" className="bg-white " name="bistroFlag" onChange={()=>setBistroFlag(!bistroFlag)}/>
                <label className="text-lg">{txt}</label>
                <IoStorefrontSharp size={30} className={`${bistroFlag ? 'text-green-500': ""}`}/>
            </span> 
        </Fragment>
    )
}