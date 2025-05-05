import { Router } from "express";
import {catalogMaker, dataFormNewProduct, changeStatus,editProductInfo,eliminarProductoDB } from "../controllers/product.controllers.js";
import { storageCustomCloudinary } from '../cloudinary.js'
import multer from 'multer'


export const productRoutes = Router()



function multerMiddleware(){
    // const storage = multer.memoryStorage() //guardo en ram del servidor la imagen
    const upload = multer({storage: storageCustomCloudinary}) //storage de cloudinary
    return upload
}


productRoutes.get('/bringAllCatalog/:idAdmin', catalogMaker)

productRoutes.post('/uploadProduct/:idAdmin',multerMiddleware().single('imagen'),dataFormNewProduct)

//siempre que use 'Content-Type': 'multipart/form-data' tengo que passarle el middleware de multer para ver la informacion de la req o upload.none() se usa cuando solo estás enviando texto, no archivos.
productRoutes.put('/editProductInfo',multerMiddleware().single('imagen'),editProductInfo)

productRoutes.put('/disponibilidad',changeStatus)



productRoutes.delete('/eliminarProducto/:id',eliminarProductoDB)





