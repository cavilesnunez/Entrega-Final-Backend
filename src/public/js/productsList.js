const socket = io();
const productsContainer = document.querySelector('.datagrid');

socket.on('datagrid', data => {
    const products = data.products;


    // Limpiar el contenido anterior del contenedor
    productsContainer.innerHTML = '';

    // Crear y agregar elementos de producto al contenedor
    products.forEach(prod => {
        const productDiv = document.createElement('div');
        //productDiv.classList.add('product'); 
        console.log('Producto:', prod);

        productDiv.innerHTML = `
            <p>Id: ${prod.id}</p>
            <p>Title: ${prod.title}</p>
            <p>Description: ${prod.description}</p>
            <p>Price: ${prod.price}</p>
            <p>Thumbnail: ${prod.thumbnail}</p>
            <p>Code: ${prod.code}</p>
            <p>Stock: ${prod.stock}</p>
        `;

        productsContainer.appendChild(productDiv);
    });
});






