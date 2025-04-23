import {Router} from "express";
import {getALLorders,sendPreOrder, pivoteDePreOrdenes, PreOrderManager} from "../controllers/preOrder.controllers.js"




export const preOrderRoutes = Router()

preOrderRoutes.get('/getAllOrders/:idTarget?',getALLorders) //me traigo todas las ordenes hechas al perfil 


preOrderRoutes.get('/getAllPreOrders/:idTarget?',pivoteDePreOrdenes) //pivote de preordenes para verlas en el front

preOrderRoutes.post('/sendPreOrder',sendPreOrder) //manda la orden del usuario


preOrderRoutes.post('/PreOrderManagement/:idOrden?',PreOrderManager) //manejador de estados de la preorden


