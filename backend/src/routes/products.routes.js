import {Router} from "express";
import {shoppingCart} from "../controllers/products.controllers.js"

export const productRoutes = Router()

productRoutes.post('/shoppingCart',shoppingCart)