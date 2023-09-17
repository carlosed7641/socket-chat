import { response } from "express"
import jwt from 'jsonwebtoken'
import User from '../models/user.js'


export const validateJWT = async (req, res = response, next) => {

    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETPRIVATEKEY)

        // Leer el usuario que corresponde al uid
        const user = await User.findById(uid)

        if (!user) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB'
            })
        }

        // Verificar si el usuario existe en la DB
        if (!user.state) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB'
            })
        }

        req.user = user

        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg: 'Token no válido'
        })
    }


}