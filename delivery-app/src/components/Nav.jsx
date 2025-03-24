import LogoutBTN from "./LogoutBTN";



export default function Nav(){
    return(
        <div className="flex flex-row mt-auto bg-red-600 justify-evenly p-4 w-full rounded-t-4xl">
            <h1 >Profile</h1>
            <LogoutBTN/>
       </div>
    )
}