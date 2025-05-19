import userSchema from '../models/user.schema.js'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { connectedAdmins, io } from '../webSocket.js'; 


import dotenv from 'dotenv'

dotenv.config({
    path:`src/envs/.env.${process.env.NODE_ENV}`
})





export const loginUser = async(req,res)=>{
    const {username,password} = req.body
    let userInfo
    try {
        
        const loginUserTarget = await userSchema.findOne({username})

        const isValid = loginUserTarget? bcrypt.compareSync(password,loginUserTarget.password) : false
    
        if(!loginUserTarget || !isValid){
    
            const alerta = loginUserTarget ? 
            `La contraseña no es valida`:
            `El usuario no es valido`
    
    
            return res.status(400).json({message:alerta})
            
        } 
        
        const token = jwt.sign(
            {id:loginUserTarget._id,username:loginUserTarget.username},
            process.env.SECRET_JWT_TOKEN_KEY,
            {
                expiresIn:'7d'
            }
        )


        if(loginUserTarget.rol === 'admin'){

            userInfo = {
                id:loginUserTarget._id,
                username: loginUserTarget.username,
                direccion: loginUserTarget.direccion,
                localidad: loginUserTarget.localidad,
                entreCalles:loginUserTarget.entreCalles,
                telefono:loginUserTarget.telefono,
                rol: loginUserTarget.rol,
                categorias: loginUserTarget.categorias
            }
        }else{
            userInfo = {
                id:loginUserTarget._id,
                username: loginUserTarget.username,
                direccion: loginUserTarget.direccion,
                localidad: loginUserTarget.localidad,
                entreCalles:loginUserTarget.entreCalles,
                telefono:loginUserTarget.telefono
            }
        }

        



        res.status(200)
        .cookie('access_token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        })
        .json({
            message:`Bienvenido, ${loginUserTarget.username}`,
            userInfo,
            token:token
        })

    



    } catch (error) {
        console.log(error)
    }




   
}


export const registerUser = async (req,res)=>{
    const {username,password,direccion,telefono,localidad,entreCalles} = req.body
    

    try {
        

        const userDuplciated = await userSchema.findOne({username})
       

        // console.log(userDuplciated || emailDuplciated)

        if(userDuplciated){

            const alerta = userDuplciated ? 
            `El usuario ${userDuplciated.username} ya esta registrado`: ""
            


            return res.status(400).json({message:alerta})
            
        } 

        const hashedPassword = await bcrypt.hash(password,10)

        new userSchema({
            username,
            password:hashedPassword,
            direccion,
            localidad,
            entreCalles,
            telefono,
            hintPassword:password,

        }).save()
    
        res.json({message:`Usuario creado: ${username}`})


    } catch (error) {
        console.log(error)
    }



}



export const editProfileInfo = async(req,res)=>{
    const {userID,editableInfo} =  req.body

   
    try {
        
        const newUserInfo = await userSchema.findByIdAndUpdate(userID,editableInfo,{new:true})


        io.emit('newUserInfo',
            {
            username: newUserInfo.username,
            direccion: newUserInfo.direccion,
            localidad: newUserInfo.localidad,
            entreCalles: newUserInfo.entreCalles,
            telefono: newUserInfo.telefono,
            rol:newUserInfo.rol
        })


        res.status(200).json({message:"Usuario actualizado"});

    } catch (error) {
        console.log(error)
    }

}



export const agregarCategoriaDeProductoAlLocal = async(req,res)=>{
    const {id,categoria} = req.body

    try {

        const nuevaCategoriaAgregada = await userSchema.findByIdAndUpdate(id,{$addToSet : {categorias: categoria}},{new:true})

       

        if(nuevaCategoriaAgregada){

            io.emit('categoriaAgregada',{
                status:true,
                listaCategorias:nuevaCategoriaAgregada.categorias
            })

            res.json({"message":`La categoria: ${categoria.toUpperCase()} fue agregada`})
        }




    } catch (error) {
        console.log(error)
    }



}





export const findRestaurant = async (req,res) =>{
    const {idRestaurant} = req.params

    const targetRestaurant = await userSchema.findById(idRestaurant)

    res.status(200).json({deliveryStatus:targetRestaurant.doDelivery})
}

export const estadoDelDelivery = async (req,res)=>{
    const {idRestaurant,flagDelivery} = req.body

    try {
        const target = await userSchema.findByIdAndUpdate(idRestaurant,{$set:{doDelivery:!flagDelivery}},{new:true})
        
        io.emit('cambioDeEstadoDelivery',target.doDelivery)

        res.status(200).json({deliveryStatus:target.doDelivery})
    } catch (error) {
        console.log(error)
    }

}

