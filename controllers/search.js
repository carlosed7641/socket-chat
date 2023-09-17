import { response } from "express"
import { isValidObjectId } from 'mongoose'
import User from '../models/user.js'
import Product from '../models/product.js'
import Category from '../models/category.js'

const collections = [
    'users',
    'categories',
    'products',
    'roles'
]

const searchUsers = async (term = '', res = response) => {

    const isMongoId = isValidObjectId(term)

    if (isMongoId) {
        const user = await User.findById(term)

        return res.json({
            results: user ? [user] : []
        })
    }

    const regex = new RegExp(term, 'i')

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
    })

    res.json({
        total: users.length,
        results: users
    })

}

const searchCategories = async (term = '', res = response) => {

    const isMongoId = isValidObjectId(term)

    if (isMongoId) {
        const category = await Category.findById(term)

        return res.json({
            results: category ? [category] : []
        })
    }

    const regex = new RegExp(term, 'i')

    const categories = await Category.find({ name: regex, status: true })

    res.json({
        total: categories.length,
        results: categories
    })
}


const searchProduct = async (term = '', res = response) => {

    const isMongoId = isValidObjectId(term)

    if (isMongoId) {
        const product = await Product.findById(term)
        .populate('category', 'name')

        return res.json({
            results: product ? [product] : []
        })
    }

    const regex = new RegExp(term, 'i')

    const products = await Product.find({ name: regex, status: true })
                                .populate('category', 'name')


    res.json({
        total: products.length,
        results: products
    })

}

export const searchContoller = (req, res = response) => {

    const { collection, term } = req.params

    if (!collections.includes(collection)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${collections}`
        })
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res)
            break

        case 'categories':
            searchCategories(term, res)
            break

        case 'products':
            searchProduct(term, res)
            break

        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
    }

}