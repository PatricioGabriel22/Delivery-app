import { Router } from "express";
import { changeStatus } from "../controllers/product.controllers.js";




export const productRoutes = Router()




productRoutes.put('/disponibilidad',changeStatus)