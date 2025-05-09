import { Router } from "express";
import { loginUser, registerUser, editProfileInfo,agregarCategoriaDeProductoAlLocal,pagarConMP } from "../controllers/user.controllers.js"

import jwt from "jsonwebtoken"


export const userRoutes = Router()




userRoutes.use((req,res,next)=>{
    const token = req.cookies?.access_cookie
    
    let data = null 
    

    req.session = {user:null}

    
    if(token){

        try{

            data = jwt.verify(token,process.env.SECRET_JWT_TOKEN_KEY)
            req.session.user = data


        }catch(error){
            console.log(error)
            
        }

    }

    next()

})



userRoutes.post('/login',loginUser)

userRoutes.post('/register',registerUser)


userRoutes.post('/editProfileInfo',editProfileInfo)

userRoutes.post('/addCategoriaAlPerfil',agregarCategoriaDeProductoAlLocal)


userRoutes.post('/create_preference_MP',pagarConMP)