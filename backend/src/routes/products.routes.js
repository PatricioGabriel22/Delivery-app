import {Router} from "express";
import {shoppingCart,checkPreOrderWithLocal, getAllPreOrders, handlePreOrder} from "../controllers/products.controllers.js"

export const productRoutes = Router()

productRoutes.post('/shoppingCart',shoppingCart)

productRoutes.post('/sendPreOrder',checkPreOrderWithLocal)

productRoutes.post('/getAllPreOrders',getAllPreOrders)


productRoutes.post('/acceptPreOrder',handlePreOrder)