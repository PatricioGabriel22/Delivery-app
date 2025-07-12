import userSchema from '../models/user.schema.js'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { connectedBistros, io } from '../webSocket.js'; 


import dotenv from 'dotenv'
import preOrderSchema from '../models/preOrder.schema.js';
import pedidosSchema from '../models/pedidosSchema.js';
import bistroSchema from '../models/bistro.schema.js';

dotenv.config({
    path:`src/envs/.env.${process.env.NODE_ENV}`
})





export const loginUser = async(req,res)=>{
    const {bistroFlag,username,password} = req.body

    let loginTarget
   

    try {
        
        if(!bistroFlag){
            loginTarget = await userSchema.findOne({username})

        }else{
            loginTarget = await bistroSchema.findOne({username})
        }

        const isValid = loginTarget? bcrypt.compareSync(password,loginTarget.password) : false
    
        if(!loginTarget || !isValid){
    
            const alerta = loginTarget ? 
            `La contraseña no es valida`:
            `El usuario no es valido`
    
    
            return res.status(400).json({message:alerta})
            
        } 
        
       

        const token = jwt.sign(
            {id:loginTarget._id,username:loginTarget.username},
            process.env.SECRET_JWT_TOKEN_KEY,
            {
                expiresIn:'7d'
            }
        )


        res.status(200)
        .cookie('access_token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        })
        .json({
            message:`Bienvenido, ${loginTarget.username}`,
            userInfo:loginTarget,
            token:token
        })

    



    } catch (error) {
        console.log(error)
    }




   
}


export const registerUser = async (req,res)=>{
    const {bistroFlag,username,password,direccion,telefono,localidad,entreCalles} = req.body
    
    console.log(req.body)


    try {
        
        if(!bistroFlag){

            const userDuplciated = await userSchema.findOne({username})
            
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

        } else if(bistroFlag){

            const bistroDuplciated = await bistroSchema.findOne({username})
            
            if(bistroDuplciated){
                
                const alerta = bistroDuplciated ? 
                `El local ${bistroDuplciated.username} ya esta registrado`: ""
                
                return res.status(400).json({message:alerta})
                
            } 
        
            const hashedPassword = await bcrypt.hash(password,10)

            new bistroSchema({
                username,
                password:hashedPassword,
                direccion,
                localidad,
                entreCalles,
                telefono,
                hintPassword:password,
                tokenMercadoPago:false
    
            }).save()

            res.json({message:`Local registrado: ${username}`})

        }


    } catch (error) {
        console.log(error)
    }



}



export const editProfileInfo = async(req,res)=>{
    const {userID,editableInfo} =  req.body
    console.log(req.body)
   
    try {

        const sanitizedInfo = {};
        // reemplaza cualquier grupo de espacios múltiples (o tabs) dentro del string por un solo espacio.
        for (const key in editableInfo) {
            const value = editableInfo[key];
            sanitizedInfo[key] = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value;
        }
        
        const newUserInfo = await userSchema.findByIdAndUpdate({_id:userID},sanitizedInfo,{new:true})


        io.emit('newUserInfo',newUserInfo)


        res.status(200).json({message:"Usuario actualizado"});

    } catch (error) {
        console.log(error)
    }

}



export const cancelarMiCompra = async(req,res)=>{

    const {preOrdenID,pedidoID,username,bistroID} = req.body

    try {
        await preOrderSchema.findByIdAndDelete(preOrdenID)
        await pedidosSchema.findByIdAndDelete(pedidoID)

        io.to(connectedBistros[bistroID]).emit('canceloMiPedido',{
            message:`${username} decidió cancelar su pedido`,
            pedidoID,
            preOrdenID
        })

        res.status(200).json({message:"El pedido fue eliminado y retirado del sistema, aniquilado. Destruido."})

    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Algo salió mal"})
    }

}


export const getAllOpenBistros = async (req,res)=>{
    try {
        const openBistros = await bistroSchema.find({isOpen:true})
        
        res.status(200).json({openBistros})

    } catch (error) {
        console.log(error)
    }
}
