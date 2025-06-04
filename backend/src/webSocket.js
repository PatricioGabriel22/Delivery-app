import {Server as SocketServer} from 'socket.io'
import http from 'http'
import express from 'express'

import dotenv from 'dotenv'
import userSchema from './models/user.schema.js'

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


export const connectedBistros = {}
export const connectedUsers = {}


io.on('connection', (socket) => {
    console.log("cliente conectado:", socket.id)


    socket.on('sesionIniciada', async (sessionPayload) => {
        socket.username = sessionPayload.username
        socket.localidad = sessionPayload.localidad
        socket.userId = sessionPayload._id
        socket.rol = sessionPayload.rol
        

        if(socket.rol === 'bistro'){
            
            // connectedBistros[socket.userId] = socket.id
            if(!connectedBistros[socket.userId]){
                connectedBistros[socket.userId] = []
            }

            if(!connectedBistros[socket.userId].includes(socket.id)){
                connectedBistros[socket.userId].push(socket.id)
            }
            
            console.log("bistro conectado",connectedBistros)
            

        }else if(!socket.rol){



            const dataUserOnSession = {
                username:socket.username,
                localidad:socket.localidad,
                socketId:socket.id,
                
            }


            connectedUsers[socket.userId] = dataUserOnSession
      
            console.log("Usuarios conectados",connectedUsers)


        }

        //cambiar a futuro con los distintos bistroID
        if(connectedBistros['6806b8fe2b72a9697aa59e5f']){

            io.to(connectedBistros['6806b8fe2b72a9697aa59e5f']).emit('usuariosConectados',Object.values(connectedUsers))

            // connectedBistros['6806b8fe2b72a9697aa59e5f'].forEach((connection)=>{
            //     io.to(connection).emit('usuariosConectados',Object.values(connectedUsers))
            // })
        }


    })

    socket.on('disconnect', () => {
        if(socket.rol === 'bistro' &&  connectedBistros[socket.userId]){
            connectedBistros[socket.userId] = connectedBistros[socket.userId].filter(targetID=> targetID != socket.id)
            
            if(connectedBistros[socket.userId].length === 0){
                delete  connectedBistros[socket.userId]
            }

        }else if(!socket.rol){
            delete connectedUsers[socket.userId]
        }

        // Emitir la nueva lista de usuarios conectados en el bistroe
        io.to(connectedBistros['6806b8fe2b72a9697aa59e5f']).emit('usuariosConectados', Object.values(connectedUsers))

        console.log("usuario desconectado")
    })
})


