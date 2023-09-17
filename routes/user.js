import { Router } from 'express'
import { check } from 'express-validator'
import { usersDelete, usersGet, usersPatch, usersPost, usersPut } from '../controllers/user.js'
import { existUserById, isEmailValid, isRoleValid } from '../helpers/db-validators.js'
import { haveRole, validateFields, validateJWT } from '../middlewares/index.js'

export const users = Router()

users.get('/', usersGet)

users.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existUserById),
    check('role').custom(isRoleValid),
    validateFields
],usersPut)

users.post('/', [ 
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y más de 6 letras').isLength({ min: 6 }),
    check('email', 'El correo no es válido').isEmail(),
    //check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('email').custom(isEmailValid),
    check('role').custom(isRoleValid),
    validateFields
],
usersPost)

users.delete('/:id', [
    validateJWT,
    //isAdminRole,
    haveRole('ADMIN_ROLE', 'SALES_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existUserById),
], usersDelete)

users.patch('/', usersPatch)