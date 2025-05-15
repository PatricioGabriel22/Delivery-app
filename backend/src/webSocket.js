import {Server as SocketServer} from 'socket.io'
import http from 'http'
import express from 'express'

import dotenv from 'dotenv'

dotenv.config({
    path:`src/envs/.env.${process.env.NODE_ENV}`
})


export const server = express()
export const frontURL = process.env.FRONT_URL

// Este servidor HTTP se necesita para conectar Express + Socket.io
export const httpServer = http.createServer(server);

// Socket.io se engancha al servidor HTTP
export const io = new SocketServer(httpServer, {
    cors: {
    origin: frontURL,
    credentials: true
    }
})


export const connectedAdmins = {}
export const connectedUsers = {}


io.on('connection', (socket) => {
    console.log("cliente conectado:", socket.id)


    socket.on('sesionIniciada', (sessionPayload) => {
        
        socket.username = sessionPayload.username
        socket.localidad = sessionPayload.localidad
        socket.userId = sessionPayload.id
        socket.rol = sessionPayload.rol
        

        if(socket.rol === 'admin'){
            
            connectedAdmins[socket.userId] = socket.id
            console.log("Usuario admin",sessionPayload.username)



        }else if(!socket.rol){



            const dataUserOnSession = {
                username:socket.username,
                localidad:socket.localidad,
                socketId:socket.id,
                rol:sessionPayload.rol
            }


            connectedUsers[socket.userId] = dataUserOnSession
            console.log("Usuario conectado",sessionPayload.username)



        }

        //cambiar a futuro con los distintos restaurantID
        if(connectedAdmins['6806b8fe2b72a9697aa59e5f']){

            io.to(connectedAdmins['6806b8fe2b72a9697aa59e5f']).emit('usuariosConectados',Object.values(connectedUsers))
        }

        console.log("Usuarios conectados:",connectedUsers)

    })

    socket.on('disconnect', () => {
        if(socket.rol === 'admin'){
            delete connectedAdmins[socket.userId]
        }else if(!socket.rol){
            delete connectedUsers[socket.userId]
        }

        // Emitir la nueva lista de usuarios conectados en el restaurante
        io.to(connectedAdmins['6806b8fe2b72a9697aa59e5f']).emit('usuariosConectados', Object.values(connectedUsers))

        console.log("usuario desconectado")
    })
})


