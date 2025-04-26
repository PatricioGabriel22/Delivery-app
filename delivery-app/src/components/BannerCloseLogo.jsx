import { Fragment } from "react";






export default function BannerCloseLogo({close}){
    return(
        <Fragment>
            <div className=" flex justify-between  cursor-pointer items-center">
                <img src="/vite.png" className="h-20"/>
                <span onClick={close} className=" bg-red-700 p-2 text-white rounded ">X</span>
            </div>

        </Fragment>
    )
}