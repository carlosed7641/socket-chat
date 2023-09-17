import { Router } from 'express'
import { check } from 'express-validator'
import { validateFields, validateFile } from '../middlewares/index.js'
import { showImage, updateImageClodinary, uploadFiles } from '../controllers/uploads.js'
import { allowedCollections } from '../helpers/db-validators.js'


export const uploads = Router()


uploads.post('/', validateFile, uploadFiles)

uploads.put('/:collection/:id', [
    validateFile,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields
], updateImageClodinary)

uploads.get('/:collection/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields
], showImage)