import { Router } from 'express'
import { searchContoller } from '../controllers/search.js'



export const search = Router()

search.get('/:collection/:term', searchContoller)