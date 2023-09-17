import { response } from "express"
import Product from '../models/product.js'


export const getProducts = async (req, res = response) => {

    const { limit = 5, from = 0 } = req.query
    const query = { status: true }

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({
        total,
        products
    })
}

export const getProduct = async (req, res = response) => {

    const { id } = req.params

    const product = await Product.findById(id)
    .populate('user', 'name')
    .populate('category', 'name')

    res.json(product)

}

export const createProduct = async (req, res = response) => {

    const { status, user, ...body } = req.body

    const productDB = await Product.findOne({ name: body.name })

    if (productDB) {
        return res.status(400).json({
            msg: `La categoria ${productDB.name} ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id
    }

    const product = new Product(data)

    // Guardar DB
    await product.save()


    res.status(201).json(product)
}

export const updateProduct = async (req, res = response) => {

    const { id } = req.params

    const { status, user, ...data } = req.body

    if (data.name) {
          data.name = data.name.toUpperCase()
    }

    data.user = req.user._id

    const product = await Product.findByIdAndUpdate(id, data, { new: true })

    res.json(product)
}

export const deleteProduct = async (req, res = response) => {

    const { id } = req.params

    const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true })

    res.json(product)
}