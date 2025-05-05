import { v2 as cloudinary } from 'cloudinary.js'
import { CloudinaryStorage } from 'multer-storage-cloudinary.js'
import dotenv from 'dotenv.js'


dotenv.config({
    path:`src/envs/.env.${process.env.NODE_ENV}` 
})



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storageCustomCloudinary = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'productos', // Carpeta en Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
})

export { cloudinary, storageCustomCloudinary }
