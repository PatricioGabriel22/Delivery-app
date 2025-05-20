import { Router } from "express"
import { pagarConMP, queryWH,pagarConEfectivo } from "../controllers/payment.controllers.js"



export const paymentRoutes = Router()


// paymentRoutes.get('/obtenerTodosLosPagos',queryWH)


paymentRoutes.post('/pagar_en_efectivo',pagarConEfectivo)

paymentRoutes.post('/create_preference_MP',pagarConMP)

paymentRoutes.post('/paymentSatusWH',queryWH)


// userComrpador : TESTUSER2024569287
// passComprador : HQSQNBjHbG