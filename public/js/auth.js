
const form = document.querySelector('form')


form.onsubmit = (e) => {
    e.preventDefault()

    const formData = {}

    for (let element of form.elements) {
        if (element.name.length > 0) {
            formData[element.name] = element.value
        }
    }

    console.log(formData)


    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(({msg, token}) => {
            if (msg) return console.error(msg)
            localStorage.setItem('token', token)
            window.location = 'chat.html'
        })
    .catch(error => {
        console.log(error)
    })
   
}

function handleCredentialResponse(response) {

    const body = {
        id_token: response.credential
    }
    // Google Token: ID_token
    fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then(response => response.json())
        .then(({token}) => {
            localStorage.setItem('token', token)
            window.location = 'chat.html'
        })
        .catch(error => {
            console.log(error)
        })

}

const button = document.getElementById('google_signout')

button.onclick = () => {

    google.accounts.id.disableAutoSelect()

    google.accounts.id.revoke(localStorage.getItem('email'), () => {
        localStorage.clear()
        location.reload()
    })
}