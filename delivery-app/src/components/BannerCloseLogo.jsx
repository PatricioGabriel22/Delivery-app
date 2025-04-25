import { Fragment } from "react";






export default function BannerCloseLogo({close}){
    return(
        <Fragment>
            <div className="relative flex justify-between  cursor-pointer items-center">
                <img src="/vite.png" className="sticky h-24"/>
                <span onClick={close} className="sticky  bg-red-700 p-3 text-white rounded-lg ">X</span>
            </div>

        </Fragment>
    )
}