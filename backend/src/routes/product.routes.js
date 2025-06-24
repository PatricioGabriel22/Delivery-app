import { Router } from "express";
import {catalogMaker, dataFormNewProduct, changeStatus,editProductInfo,eliminarProductoDB } from "../controllers/product.controllers.js";
import { multerMiddleware } from "../middlewares/imageCloudinaryFunc.js";



export const productRoutes = Router()





productRoutes.get('/bringAllCatalog/:idBistro?', catalogMaker)

productRoutes.post('/uploadProduct/:idBistro?',multerMiddleware().single('imagen'),dataFormNewProduct)

//siempre que use 'Content-Type': 'multipart/form-data' tengo que passarle el middleware de multer para ver la informacion de la req o upload.none() se usa cuando solo estás enviando texto, no archivos.
productRoutes.put('/editProductInfo',multerMiddleware().single('imagen'),editProductInfo)

productRoutes.put('/disponibilidad',changeStatus)



productRoutes.delete('/eliminarProducto/:id',eliminarProductoDB)





