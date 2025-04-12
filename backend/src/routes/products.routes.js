import {Router} from "express";
import {sendPreOrder, getAllPreOrders, PreOrderManager, dataFormWithImage} from "../controllers/products.controllers.js"

import multer from 'multer'


export const productRoutes = Router()


productRoutes.post('/sendPreOrder',sendPreOrder) //manda la orden el usuario

productRoutes.get('/getAllPreOrders',getAllPreOrders) //me traigo todas las ordenes hechas al perfil pana

productRoutes.post('/PreOrderManagement/:idOrden?',PreOrderManager)


function multerMiddleware(){
    const storage = multer.memoryStorage() //guardo en ram del servidor la imagen
    const upload = multer({storage}) //crea el middleware
    return upload
}


productRoutes.post('/uploadProduct',multerMiddleware().single('imagen'),dataFormWithImage)