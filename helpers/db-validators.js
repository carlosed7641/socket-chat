import Role from '../models/role.js'
import User from '../models/user.js'
import Category from '../models/category.js'
import Product from '../models/product.js'


export const isRoleValid = async (role = '') => {
    const existRole = await Role.findOne({ role })
    if (!existRole) throw new Error(`El rol ${role} no está registrado en la BD`)
}

export const isEmailValid = async (email = '') => {
    // Verificar si el correo existe
    const existEmail = await User.findOne({ email })
    if (existEmail) throw new Error(`El correo ${email} ya está registrado`)
}

export const existUserById = async (id) => {
    // Verificar si el correo existe
    const existUser = await User.findById(id)
    if (!existUser) throw new Error(`El id ${id} no existe`)
}

export const existCategoryById = async (id) => {
    // Verificar si la categoría existe
    const existCategory = await Category.findById(id)
    if (!existCategory) throw new Error(`El id ${id} no existe`)
}

export const existProductById = async (id) => {
    // Verificar si el producto existe
    const existProduct = await Product.findById(id)
    if (!existProduct) throw new Error(`El id ${id} no existe`)
}

export const allowedCollections = (collection = '', collections = []) => {
    const included = collections.includes(collection)
    if (!included) throw new Error(`La colección ${collection} no es permitida, ${collections}`)
    return true
}