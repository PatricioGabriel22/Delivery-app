import cors from 'cors'
import express from 'express'


import dotenv from 'dotenv'

import { connectDB } from './DB.js'
import { userRoutes } from './routes/user.routes.js'
import {preOrderRoutes} from './routes/preOrder.routes.js'
import { productRoutes } from './routes/product.routes.js'
import { httpServer,server,serverURL } from './webSocket.js'


dotenv.config()




try {

    await connectDB(process.env.MONGO_CLUSTER_TEST)
} catch (error) {
    console.log(error)
}
console.log(serverURL)

server.use(cors({ origin: serverURL , credentials: true })) 
server.use(express.json())


server.use(userRoutes)
server.use(preOrderRoutes)
server.use(productRoutes)

// Iniciar el servidor HTTP + WebSocket en el mismo puerto
httpServer.listen(Number(process.env.PORT) , () => {
    console.log(`HTTP + WebSocket server running on port ${process.env.PORT}`)
})