let user = null
let socket = null

// Referencias HTML
const txtUid = document.querySelector('#txtUid')
const txtMessage = document.querySelector('#txtMessage')
const ulUsers = document.querySelector('#ulUsers')
const ulMessages = document.querySelector('#ulMessages')
const btnLogout = document.querySelector('#btnLogout')


const validateJWT = async() => {
    const token = localStorage.getItem('token') || ''
    if(token.length <= 10){
        window.location = 'index.html'
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch('http://localhost:8080/api/auth', {
        headers: {'x-token': token}
    })

    const {user: userDB, token: tokenDB} = await resp.json()
    //console.log(userDB, tokenDB)
    localStorage.setItem('token', tokenDB)
    user = userDB
    document.title = user.name

    await connectSocket()
}

const connectSocket = async() => { 
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    })

    socket.on('connect', () => {
        console.log('Sockets online')
    })

    socket.on('disconnect', () => {
        console.log('Sockets offline')
    })

    socket.on('receive-messages', renderMessages)

    socket.on('active-users', renderUsers)

    socket.on('private-message', (payload)=> {
       console.log('Privado', payload)
    })
}

const renderUsers = (users = []) => {
    let usersHTML = ''
    users.forEach(({name, uid}) => {
        usersHTML += `
            <li>
                <p>
                    <h5 class="text-success">${name}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    })
    ulUsers.innerHTML = usersHTML
}

const renderMessages = (messages = []) => {

    // const colors = ["red", "blue", "green", "yellow", "orannge", "purple"]
    // const random = colors[Math.floor(Math.random() * colors.length)]

    let messsageHTML = ''
    messages.forEach(({name, message}) => {
        messsageHTML += `
            <li>
                <p>
                    <span style="color: blue;">${name}</span>
                    <span>${message}</span>
                </p>
            </li>
        `
    })
    ulMessages.innerHTML = messsageHTML
}

txtMessage.addEventListener('keyup', ({keyCode}) => {

    const message = txtMessage.value
    const uid = txtUid.value

    if (keyCode !== 13) return
    if(message.trim().length === 0) return


    socket.emit('send-message', { message, uid})

    txtMessage.value = ''


})

const main = async() => {
   await validateJWT()
}

main()

//const socket = io()