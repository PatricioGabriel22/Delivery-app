import { v2 as cloudinary } from 'cloudinary'
import { storageCustomCloudinary } from '../cloudinary.js'
import multer from 'multer'
import { connectedUsers,connectedBistros, io } from "../webSocket.js" 


export function multerMiddleware(){
    // const storage = multer.memoryStorage() //guardo en ram del servidor la imagen
    const upload = multer({storage: storageCustomCloudinary}) //storage de cloudinary
    return upload
}






export async function modifyData(idTarget,schema,updateParams,file,eventName){
    const targetPrevio = await schema.findById(idTarget)

    if(file){
        const newImagen = file.path
        updateParams.img = newImagen
        updateParams.public_IMG_ID = file.filename

        if(targetPrevio.public_IMG_ID){

            await cloudinary.uploader.destroy(targetPrevio.public_IMG_ID)
        }

    }   

    console.log(updateParams)
    const targetUpdated = await schema.findByIdAndUpdate(idTarget,updateParams,{new:true})

    const {
        username,
        email,
        direccion,
        localidad,
        entreCalles,
        telefono,
        rol,
        categorias,
        doDelivery,
        img,
        zonas_delivery,
        isOpen,
        mediosDePago
    } = targetUpdated


    const dataReducida = {
        username,
        email,
        direccion,
        localidad,
        entreCalles,
        telefono,
        rol,
        categorias,
        doDelivery,
        img,
        zonas_delivery,
        isOpen,
        mediosDePago
    }

    io
    .to(connectedBistros[idTarget])
    .to(connectedUsers)
    .emit(eventName,dataReducida)
}