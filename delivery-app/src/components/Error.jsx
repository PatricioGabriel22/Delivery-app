import { Fragment } from "react";
import { VscError } from "react-icons/vsc";




export default function Error({msg}){
    return(
        <Fragment>
                <span className="flex flex-col w-full h-full items-center justify-center">

                    <VscError color="#f90b0b"  className="self-center mt-10 text-9xl"/>
                    <p className="text-lg">{msg}</p>

                </span>
        </Fragment>
    )
}