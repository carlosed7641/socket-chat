import { Socket } from "socket.io"
import { validateJWT } from "../helpers/generate-jwt.js"
import { ChatMessages } from "../models/chat-message.js"

const chatMessages = new ChatMessages()

export const socketController = async (socket = new Socket(), io) => {

    const token = socket.handshake.headers['x-token']
    const user = await validateJWT(token)

    if (!user) return socket.disconnect()

    // Agregar el usuario conectado
    chatMessages.connectUser(user)
    io.emit('active-users', chatMessages.getUsersArr())
    socket.emit('receive-messages', chatMessages.getLast10())

    // Conectarlo a una sala especial
    socket.join(user.id) // global, socket.id, user.id

    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMessages.disconnectUser(user.id)
        io.emit('active-users', chatMessages.getUsersArr())
    })

    socket.on('send-message', ({ uid, message }) => {
        if (uid) {
            // Mensaje privado
            socket.to(uid).emit('private-message', { from: user.name, message })
        } else {
            chatMessages.setMessage(user.id, user.name, message)
            io.emit('receive-messages', chatMessages.getLast10())
        }
    })
}