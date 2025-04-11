import {Router} from "express";
import {sendPreOrder, getAllPreOrders, PreOrderManager} from "../controllers/products.controllers.js"

export const productRoutes = Router()


productRoutes.post('/sendPreOrder',sendPreOrder) //manda la orden el usuario

productRoutes.get('/getAllPreOrders',getAllPreOrders) //me traigo todas las ordenes hechas al perfil pana

productRoutes.post('/PreOrderManagement/:idOrden?',PreOrderManager)