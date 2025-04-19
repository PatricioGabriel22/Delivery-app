import {Router} from "express";
import {sendPreOrder, getAllPreOrders, PreOrderManager} from "../controllers/preOrder.controllers.js"




export const preOrderRoutes = Router()


preOrderRoutes.post('/sendPreOrder',sendPreOrder) //manda la orden el usuario

preOrderRoutes.post('/getAllPreOrders/:idTarget?',getAllPreOrders) //me traigo todas las ordenes hechas al perfil pana

preOrderRoutes.post('/PreOrderManagement/:idOrden?',PreOrderManager)


