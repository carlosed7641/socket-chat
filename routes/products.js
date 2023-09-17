import { Router } from "express"
import { isAdminRole, validateFields, validateJWT } from '../middlewares/index.js'
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/products.js"
import { existCategoryById, existProductById } from "../helpers/db-validators.js"
import { check } from "express-validator"


export const products = Router()


// Obtener todos los productos - publico
products.get('/',  getProducts)

// Obtener un producto por id - publico
products.get('/:id',  [ 
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existProductById),
    validateFields
], getProducts)

// Crear producto - privado - cualquier persona con un token valido
products.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un id valido').isMongoId(),
    check('category').custom(existCategoryById),
    validateFields
], createProduct)

// Actualizar - privado - cualquier persona con un token valido
products.put('/:id', [
    validateJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existProductById),
    validateFields
], updateProduct)

// Borrar un producto - Admin
products.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existProductById),
    validateFields
], deleteProduct)