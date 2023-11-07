const socket = io()

const addCartForm = document.getElementById('createCart')
const deleteCartForm = document.getElementById('deleteCart')

socket.on('cartAddedMessage', (message) => {
    Swal.fire(message)
})

socket.on('cartDeletedMessage', (message) => {
    Swal.fire(message)
})

addCartForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const cartData = Object.fromEntries(formData)

    socket.emit('newCart', cartData)

    event.target.reset()
})

deleteCartForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const cartId = event.target.cartId.value

    socket.emit('deleteCart', cartId)

    event.target.reset()
})