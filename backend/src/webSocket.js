import {Server as SocketServer} from 'socket.io'
import http from 'http'
import express from 'express'
import {PORT} from './configs/const.config.js'



export const server = express()
export const serverURL = PORT === 4000? "http://localhost:5173" : "https://delivery-app-beta-weld.vercel.app"

// Este servidor HTTP se necesita para conectar Express + Socket.io
export const httpServer = http.createServer(server);

// Socket.io se engancha al servidor HTTP
export const io = new SocketServer(httpServer, {
    cors: {
    origin: serverURL,
    credentials: true
    }
})


export const connectedAdmins = {}
export const connectedUsers = {}


io.on('connection', (socket) => {
    console.log("cliente conectado:", socket.id)


    socket.on('sesionIniciada', (sessionPayload) => {
        
        socket.userId = sessionPayload.id
        socket.rol = sessionPayload.rol

        console.log("entro")
        if(socket.rol === 'admin'){

            connectedAdmins[socket.userId] = socket.id
            console.log("Usuario admin",sessionPayload.username)

        }else if(!socket.rol){

            connectedUsers[socket.userId] = socket.id
            console.log("Usuario conectado",sessionPayload.username)
        }



    })

    socket.on('disconnect', () => {
        if(socket.rol === 'admin'){
            delete connectedAdmins[socket.userId]
        }else if(!socket.rol){
            delete connectedUsers[socket.userId]
        }

        console.log("usuario desconectado")
    })
})


