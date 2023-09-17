import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server as ServerIO } from 'socket.io'
import { users } from '../routes/user.js'
import { dbConnection } from '../database/config.js'
import { auth } from '../routes/auth.js'
import { categories } from '../routes/categories.js'
import { products } from '../routes/products.js'
import { search } from '../routes/search.js'
import { uploads } from '../routes/uploads.js'
import fileUpload from 'express-fileupload'
import { socketController } from '../sockets/controller.js'


export class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.server = createServer(this.app)
        this.io = new ServerIO(this.server)

        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users',
            search: '/api/search',
            uploads: '/api/uploads'
        }

        this.usersPath = '/api/users'
        this.authPath = '/api/auth'

        // Conectar a base de datos
        this.connectDB()

        // Middlewares
        this.middlewares()

        // Rutas de mi aplicación
        this.routes()

        // Sockets
        this.sockets()

    }

    async connectDB() {
        await dbConnection()
    }

    middlewares() {

        // CORS
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json())

        // Directorio público
        this.app.use(express.static('public'))

        // FileUpload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }))
    }

    routes() {
        this.app.use(this.paths.auth, auth)
        this.app.use(this.paths.users, users)
        this.app.use(this.paths.search, search)
        this.app.use(this.paths.categories, categories)
        this.app.use(this.paths.products, products)
        this.app.use(this.paths.uploads, uploads)
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io))
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo http://localhost:${this.port}`)
        })
    }
}