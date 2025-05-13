import userSchema from '../models/user.schema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { connectedUsers, io } from '../webSocket.js'; 

import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'

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
    const {username,email,password,direccion,telefono,localidad,entreCalles} = req.body
    

    try {
        

        const userDuplciated = await userSchema.findOne({username})
        const emailDuplciated = await userSchema.findOne({email})

        // console.log(userDuplciated || emailDuplciated)

        if(userDuplciated || emailDuplciated){

            const alerta = userDuplciated ? 
            `El usuario ${userDuplciated.username} ya esta registrado`:
            `El mail ${emailDuplciated.email} ya esta registrado`


            return res.status(400).json({message:alerta})
            
        } 

        const hashedPassword = await bcrypt.hash(password,10)

        new userSchema({
            username,
            email,
            password:hashedPassword,
            direccion,
            localidad,
            entreCalles,
            telefono,
            hintPassword:password,

        }).save()
    
        res.json({message:`Usuario creado, ${username}`})


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



const access_token_MP = 'APP_USR-8256172845098039-051009-6f781470e50160fac4e5436d6867e3f0-2432951426';
const client = new MercadoPagoConfig({ accessToken: access_token_MP });

export const pagarConMP = async (req, res) => {
    const { userInfoID, items, payer } = req.body;



    // Configuración del token de acceso
    const preference = new Preference(client);

    const urlsDeRetornoFront = {
        success: `${process.env.FRONT_URL}/pago-confirmado`,
        // failure: `${process.env.FRONT_URL}/pago-fallido`,
        // pending: `${process.env.FRONT_URL}/pago-pendiente`,
    }

   
    // ${process.env.FRONT_URL}/pago-confirmado

    const mp_bodyData = {
        items,
        payer,
        back_urls: urlsDeRetornoFront,
        auto_return: 'approved',
        notification_url : `https://delivery-app-stagingapi.onrender.com/paymentSatusWH`  
    };

    try {
        // Crear la preferencia de pago con toda la configuración correcta
        const response = await preference.create({ body: mp_bodyData });

        console.log(response);

        // Enviar la URL de inicio de pago a la respuesta del cliente
        res.json({ init_point: response.init_point }).status(200);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}


export const queryWH = async (req,res)=>{
    console.log("respuesta del WH de mercadopago: ", req.query)
    const paymentQueryMP = req.query

    if(paymentQueryMP.topic === 'payment'){

        const payment = await new Payment(client).get({id:paymentQueryMP.id})
        const username_MPpayer = payment.additional_info.payer.first_name

        if(payment.status === 'approved'){
            
            for (const [id, userInfo] of Object.entries(connectedUsers)) {
                if(userInfo.username === username_MPpayer){
                    const msg_MP_approved = `El pago de ${username_MPpayer} fue aprobado`
                    console.log(msg_MP_approved)
                    io.to(connectedUsers[id].socketId).emit('msg_MP_approved',msg_MP_approved)
                    break
                }
            }
        
        }
    }   


    return res.sendStatus(200)
}