import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controllers.js"


export const userRoutes = Router()




// userRoutes.use((req,res,next)=>{
//     const token = req.cookies?.access_cookie
    
//     let data = null 
    

//     req.session = {user:null}

    
//     if(token){

//         try{


//             data = jwt.verify(token,SECRET_JWT_TOKEN_KEY)
//             req.session.user = data
//             console.log(data)

//         }catch(error){
//             console.log(error)
            
//         }

//     }
//     next()

// })



userRoutes.post('/login',loginUser)




userRoutes.post('/register',registerUser)