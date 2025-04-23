import { Router } from "express";
import {dataFormNewProduct, changeStatus,editProductInfo } from "../controllers/product.controllers.js";

import multer from 'multer'


export const productRoutes = Router()



function multerMiddleware(){
    const storage = multer.memoryStorage() //guardo en ram del servidor la imagen
    const upload = multer({storage}) //crea el middleware
    return upload
}





productRoutes.post('/uploadProduct',multerMiddleware().single('imagen'),dataFormNewProduct)


productRoutes.put('/disponibilidad',changeStatus)



//siempre que use 'Content-Type': 'multipart/form-data' tengo que passarle el middleware de multer para ver la informacion de la req o upload.none() se usa cuando solo estás enviando texto, no archivos.

productRoutes.put('/editProductInfo',multerMiddleware().single('imagen'),editProductInfo)
