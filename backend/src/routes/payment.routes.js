import { Router } from "express"
import {pagoManagement,calcularPagosEnRango, } from "../controllers/payment.controllers.js"



export const paymentRoutes = Router()


paymentRoutes.get('/obtenerTodosLosPagos',calcularPagosEnRango)


paymentRoutes.post('/pagar',pagoManagement)

