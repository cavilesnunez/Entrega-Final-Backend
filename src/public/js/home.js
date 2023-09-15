const socket = io()

const productsContainer = document.querySelector('#productsContainer')

socket.emit('load')

socket.on('products', products => {
    const productsHTMLString = products.map(prod =>
    `<div class="product-container">
        <p><strong>Id:</strong> ${prod._id}</p>
        <p><strong>Title:</strong> ${prod.title}</p>
        <p><strong>Description:</strong> ${prod.description}</p>
        <p><strong>Price:</strong> USD $${parseFloat(prod.price).toFixed(2)}</p>
        <p><strong>Stock:</strong> ${parseFloat(prod.stock)} units</p>
        <p><strong>Code:</strong> ${prod.code}</p>
        <p>Status: ${prod.status}</p>
    </div>`)

    productsContainer.innerHTML = productsHTMLString
})



