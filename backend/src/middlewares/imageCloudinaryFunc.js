import { v2 as cloudinary } from 'cloudinary'
import { storageCustomCloudinary } from '../cloudinary.js'
import multer from 'multer'


export function multerMiddleware(){
    // const storage = multer.memoryStorage() //guardo en ram del servidor la imagen
    const upload = multer({storage: storageCustomCloudinary}) //storage de cloudinary
    return upload
}






export async function modifyData(idTarget,schema,updateParams,file,socket,eventName){
    const targetPrevio = await schema.findById(idTarget)

    if(file){
        const newImagen = file.path
        updateParams.img = newImagen
        updateParams.public_IMG_ID = file.filename

        if(targetPrevio.public_IMG_ID){

            await cloudinary.uploader.destroy(targetPrevio.public_IMG_ID)
        }

    }

    const targetUpdated = await schema.findByIdAndUpdate(idTarget,updateParams,{new:true})



    socket.emit(eventName,targetUpdated)
}