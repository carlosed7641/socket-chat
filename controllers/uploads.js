import path from 'path'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'
import { response } from "express"
import { uploadFile } from '../helpers/index.js'
import { fileURLToPath } from "url"
import User from '../models/user.js'
import Product from '../models/product.js'


cloudinary.config(process.env.CLOUDINARY_URL)

const __dirname = path.dirname(fileURLToPath(import.meta.url))


export const uploadFiles = async (req, res = response) => {

    try {

        // txt, md
        //const name = await uploadFile(req.files, ['txt', 'md'], 'textos')
        const name = await uploadFile(req.files, undefined, 'imgs')

        res.json({ name })
    } catch (msg) {
        res.status(400).json({ msg })
    }

}

export const updateImage = async (req, res = response) => {

    const { collection, id } = req.params

    let model

    switch (collection) {
        case 'users':
            model = await User.findById(id)
            if (!model) return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
            break

        case 'products':
            model = await Product.findById(id)
            if (!model) return res.status(400).json({ msg: `No existe un producto con el id ${id}` })
            break

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }

    // Limpiar imágenes previas
    if (model.img) {
        // Hay que borrar la imagen del servidor
        const pathImage = path.join(__dirname, '../uploads', collection, model.img)

        if (fs.existsSync(pathImage)) fs.unlinkSync(pathImage)

    }

    const name = await uploadFile(req.files, undefined, collection)
    model.img = name

    await model.save()

    res.json(model)

}

export const updateImageClodinary = async (req, res = response) => {

    const { collection, id } = req.params

    let model

    switch (collection) {
        case 'users':
            model = await User.findById(id)
            if (!model) return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
            break

        case 'products':
            model = await Product.findById(id)
            if (!model) return res.status(400).json({ msg: `No existe un producto con el id ${id}` })
            break

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }

    // Limpiar imágenes previas
    if (model.img) {
        // Hay que borrar la imagen del servidor
        const nameArr = model.img.split('/')
        const name = nameArr[nameArr.length - 1]
        const [public_id] = name.split('.')
        cloudinary.uploader.destroy(public_id)
    }


    const { tempFilePath } = req.files.sampleFile
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

    model.img = secure_url
    await model.save()

    res.json(model)

}

export const showImage = async (req, res = response) => {

    const { collection, id } = req.params

    let model

    switch (collection) {
        case 'users':
            model = await User.findById(id)
            if (!model) return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
            break

        case 'products':
            model = await Product.findById(id)
            if (!model) return res.status(400).json({ msg: `No existe un producto con el id ${id}` })
            break
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }

    // Limpiar imágenes previas
    if (model.img) {
        // Hay que borrar la imagen del servidor
        const pathImage = path.join(__dirname, '../uploads', collection, model.img)
        if (fs.existsSync(pathImage)) {
            return res.sendFile(pathImage)
        }
    }

    res.sendFile(path.join(__dirname, '../assets/no-image.jpg'))
}