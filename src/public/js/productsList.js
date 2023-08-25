const socket = io();
const productsContainer = document.querySelector('#products-container');

socket.on('products', products => {
    productsContainer.innerHTML = ''; 
    products.forEach(prod => {
        productsContainer.innerHTML += `
            <div class="product-container">
                <p>Id: ${prod.id}</p>
                <p>Title: ${prod.title}</p>
                <p>Description: ${prod.description}</p>
                <p>Price: ${prod.price}</p>
                <p>Status: ${prod.thumbnail}</p>
                <p>Code: ${prod.code}</p>
                <p>Stock: ${prod.stock}</p>
            </div>
        `;
    });
});

