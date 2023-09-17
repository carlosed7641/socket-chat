import { Router } from 'express'
import { check } from 'express-validator'
import { googleSignIn, login, renewToken } from '../controllers/auth.js'
import { validateFields, validateJWT } from '../middlewares/index.js'


export const auth = Router()

auth.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login)

auth.post('/google', [
    check('id_token', 'id Token de google es necesario').not().isEmpty(),
    validateFields
], googleSignIn)

auth.get('/', validateJWT, renewToken)