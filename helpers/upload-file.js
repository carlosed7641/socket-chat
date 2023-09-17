import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'

const extensions = ['png', 'jpg', 'jpeg', 'gif']
const __dirname = path.dirname(fileURLToPath(import.meta.url))


export const uploadFile = async (files, validExtensions = extensions, folder = '') => {

    return new Promise((resolve, reject) => {

        const { sampleFile } = files
        const shortName = sampleFile.name.split('.')
        const extension = shortName[shortName.length - 1]

        // Validar extension
        if (!validExtensions.includes(extension))
            return reject(`La extensión ${extension} no es permitida - ${validExtensions}`)

        // Generar el nombre del archivo
        const fileName = `${uuidv4()}.${extension}`
        // Path para guardar el archivo
        const uploadPath = path.join(__dirname, '../uploads/', folder, fileName)

        sampleFile.mv(uploadPath, (err) => {
            if (err) return reject(err)

           resolve(fileName)
        })
    })
}