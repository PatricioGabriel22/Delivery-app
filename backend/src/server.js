import cors from 'cors'
import express from 'express'



import { MONGO_CLUSTER_TEST,PORT } from './configs/const.config.js'
import { connectDB } from './DB.js'
import { userRoutes } from './routes/user.routes.js'
import {preOrderRoutes} from './routes/preOrder.routes.js'
import { productRoutes } from './routes/product.routes.js'
import { httpServer,server,serverURL } from './webSocket.js'







try {

    await connectDB(MONGO_CLUSTER_TEST)
    
} catch (error) {
    console.log(error)
}


server.use(cors({ origin: serverURL , credentials: true })) 
server.use(express.json())


server.use(userRoutes)
server.use(preOrderRoutes)
server.use(productRoutes)



httpServer.listen(PORT,()=>{
    console.log(`Server on port ${PORT}`)
})




