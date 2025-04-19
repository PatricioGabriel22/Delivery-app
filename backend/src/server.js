import express from 'express'
import cors from 'cors'

import http from 'http'
import {Server as SocketServer} from 'socket.io'


import { MONGO_CLUSTER_TEST,PORT } from './configs/const.config.js'
import { connectDB } from './DB.js'
import { userRoutes } from './routes/user.routes.js'
import {preOrderRoutes} from './routes/preOrder.routes.js'
import { productRoutes } from './routes/product.routes.js'


const serverURL = PORT === 4000? "http://localhost:5173" : "https://delivery-app-beta-weld.vercel.app"




    const server = express()
    
    // Este servidor HTTP se necesita para conectar Express + Socket.io
    const httpServer = http.createServer(server);
    
    // Socket.io se engancha al servidor HTTP
    const io = new SocketServer(httpServer, {
      cors: {
        origin: serverURL,
        credentials: true
      }
    })


try {

    await connectDB(MONGO_CLUSTER_TEST)
    
} catch (error) {
    console.log(error)
}



console.log(serverURL)

server.use(cors({ origin: serverURL , credentials: true })) 
server.use(express.json())


server.use(userRoutes)
server.use(preOrderRoutes)
server.use(productRoutes)


export const connectedUsers = {}

io.on('connection', (socket) => {
    console.log("cliente conectado:", socket.id)

    socket.on('registerUser', (userID) => {
        connectedUsers[userID] = socket.id
        console.log(`Registrado ${userID} con socket ${socket.id}`)
    })

    socket.on('disconnect', () => {
        for (let user in connectedUsers) {
            if (connectedUsers[user] === socket.id) {
                delete connectedUsers[user]
                break
            }
        }
        console.log(`Socket desconectado: ${socket.id}`)
    })
})
export {io}

httpServer.listen(PORT,()=>{
    console.log(`Server on port ${PORT}`)
})




