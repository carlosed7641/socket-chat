import { Router } from 'express'
import { check } from 'express-validator'
import { isAdminRole, validateFields, validateJWT } from '../middlewares/index.js'
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/categories.js'
import { existCategoryById } from '../helpers/db-validators.js'


export const categories = Router()

// Obtener todas las categorias - público
categories.get('/', getCategories)

// Obtener una categoria por id - público
categories.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existCategoryById),
    validateFields
], getCategory)

// Crear categoria - privado - cualquier persona con un token válido
categories.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], createCategory)

// Actualizar - privado - cualquiera con token válido
categories.put('/:id', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existCategoryById),
    validateFields
], updateCategory)

// Borrar una categoria - Admin
categories.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existCategoryById),
    validateFields
] , deleteCategory)