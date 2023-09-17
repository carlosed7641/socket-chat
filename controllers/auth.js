import { response } from "express"
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import { generateJWT } from "../helpers/generate-jwt.js"
import { googleVerify } from "../helpers/google-verify.js"

export const login = async (req, res = response) => {

    const { email, password } = req.body

    try {

        // Verificar si el email existe
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            })
        }

        // Si el usuario está activo
        if (!user.state) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }

        // Verificar la contraseña
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }
        // Generar el JWT
        const token = await generateJWT(user.id)




        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }


}

export const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body

    try {

        const { email, name, picture } = await googleVerify(id_token)

        let user = await User.findOne({ email })

        if (!user) {
            // Tengo que crearlo
            const data = {
                name,
                email,
                password: '123',
                img: picture,
                role: 'USER_ROLE',
                google: true
            }

            user = new User(data)
            await user.save()
        }

        // Si el usuario en DB 
        if (!user.state) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        // Generar el JWT
        const token = await generateJWT(user.id)

        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error, 'error')
        res.status(400).json({
            msg: 'Token de google no es válido'
        })
    }


}

export const renewToken = async (req, res = response) => {

    const { user } = req

    // Generar el JWT
    const token = await generateJWT(user.id)

    res.json({
        user,
        token
    })

}