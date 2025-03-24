import express from 'express'
import cors from 'cors'

import { MONGO_CLUSTER_TEST,PORT } from './configs/const.config.js'
import { connectDB } from './DB.js'
import { userRoutes } from './routes/user.routes.js'




const server = express()
try {
    await connectDB(MONGO_CLUSTER_TEST)
    
} catch (error) {
    console.log(error)
}



const serverURL = PORT === 4000? "http://localhost:5173" : "https://delivery-app-beta-weld.vercel.app/"
server.use(cors({ origin: serverURL , credentials: true })) 
server.use(express.json())
server.use(userRoutes)



server.listen(PORT,()=>{
    console.log(`Server on port ${PORT}`)
})




