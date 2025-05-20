import { Fragment } from "react";
import { FadeLoader } from "react-spinners";




export default function Loading({msg}){
    return(
        <Fragment>
            <span className="flex flex-col w-full h-full items-center justify-center">

                <FadeLoader color="#f90b0b" className="self-center mt-10" />

                <p className="text-lg">{msg}</p>

            </span>
        </Fragment>
    )
}