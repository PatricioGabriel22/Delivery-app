import {Router} from "express";
import {sendPreOrder, getAllPreOrders, PreOrderManager, dataFormWithImage} from "../controllers/preOrder.controllers.js"

import multer from 'multer'


export const preOrderRoutes = Router()


preOrderRoutes.post('/sendPreOrder',sendPreOrder) //manda la orden el usuario

preOrderRoutes.get('/getAllPreOrders',getAllPreOrders) //me traigo todas las ordenes hechas al perfil pana

preOrderRoutes.post('/PreOrderManagement/:idOrden?',PreOrderManager)


function multerMiddleware(){
    const storage = multer.memoryStorage() //guardo en ram del servidor la imagen
    const upload = multer({storage}) //crea el middleware
    return upload
}


preOrderRoutes.post('/uploadProduct',multerMiddleware().single('imagen'),dataFormWithImage)