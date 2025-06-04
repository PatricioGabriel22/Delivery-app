import cors from 'cors'
import express from 'express'


import dotenv from 'dotenv'

import { connectDB } from './DB.js'
import { userRoutes } from './routes/user.routes.js'
import {preOrderRoutes} from './routes/preOrder.routes.js'
import { productRoutes } from './routes/product.routes.js'
import { httpServer,server,frontURL } from './webSocket.js'
import { paymentRoutes } from './routes/payment.routes.js'
import { bistroRoutes } from './routes/bistro.routes.js'


dotenv.config({
    path:`backend/src/envs/.env.${process.env.NODE_ENV}` //decirle a dotenv donde esta el .env
})



try {

    await connectDB(process.env.MONGO_CLUSTER)
    console.log(frontURL)
} catch (error) {
    console.log(error)
}

server.use(cors({ origin: frontURL , credentials: true })) 
server.use(express.json())


server.use(userRoutes)
server.use(bistroRoutes)
server.use(preOrderRoutes)
server.use(productRoutes)
server.use(paymentRoutes)

// Iniciar el servidor HTTP + WebSocket en el mismo puerto
const puertoDeConexion = Number(process.env.PORT) || 4000

httpServer.listen(puertoDeConexion , () => {
    console.log(`HTTP + WebSocket server running on port ${puertoDeConexion}`)
})