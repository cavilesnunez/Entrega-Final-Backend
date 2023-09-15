const socket = io()

const chatButton = document.getElementById('chatButton')
const messages = document.getElementById('messages')
const inputValue = document.getElementById('chatBox')

let user

Swal.fire({
    title: "User ID",
    text: "Please enter your username",
    input: "text",
    inputValidator: (valor) => {
    return !valor && 'Enter a valid username'
},

allowOutsideClick: false
}).then(result => {
    user = result.value
    console.log(user)
})

chatButton.addEventListener('click', () => {
    let currentDate = new Date().toLocaleString()

    if (inputValue.value.trim().length > 0) {
    socket.emit('message', { date: currentDate, user: user, message: inputValue.value })

    inputValue.value = ""
    } 
})

socket.on('messages', (messagesArray) => {
    messages.innerHTML = ""

    messagesArray.forEach(({ date, user, message }) => {
    messages.innerHTML += `<p>${date} : <strong>${user} wrote</strong>: ${message}</p>`
    })
})