import { response } from 'express'
import User from '../models/user.js'
import bcrypt from 'bcryptjs'

export const usersGet = async (req, res = response) => {

    const { limit = 5, from = 0 } = req.query
    const query = { state: true }

    const [ total, users ] =  await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(from))
        .limit(Number(limit))
    ])
    

    res.json({
        total,
        users
    })
}

export const usersPut = async (req, res = response) => {

    const { id } = req.params
    const { _id, password, google, email, ...rest } = req.body

    // TODO validar contra base de datos
    if (password) {
        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync()
        rest.password = bcrypt.hashSync(password, salt)
    }

    const user = await User.findByIdAndUpdate(id, rest)

    res.json(user)
}


export const usersPost = async (req, res = response) => {

    const { name, email, password, role } = req.body
    const user = new User({ name, email, password, role })

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync()
    user.password = bcrypt.hashSync(password, salt)

    // Guardar en DB
    await user.save()

    res.json({
        user
    })
}


export const usersDelete = async(req, res = response) => {

    const { id } = req.params

    // Fisicamente lo borramos
    //const user = await User.findByIdAndDelete(id)

    const user = await User.findByIdAndUpdate(id, { state: false })
    const userAuth = req.user

    res.json({user, userAuth})
}

export const usersPatch = async(req, res = response) => {}