import { Fragment } from "react";






export default function BannerCloseLogo({close}){
    return(
        <Fragment>
            <div className=" flex justify-between  cursor-pointer items-center">
                <img src="/vite.png" className="h-19"/>
                <span onClick={close} className=" bg-red-700 p-3 text-white rounded text-2xl ">X</span>
            </div>

        </Fragment>
    )
}