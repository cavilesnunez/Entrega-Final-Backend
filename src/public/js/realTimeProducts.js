const socket = io();

const form = document.querySelector('#formProduct');
const productsContainer = document.querySelector('#products-container');

socket.emit('load');

form.addEventListener('submit', event => {
	event.preventDefault();
	const dataForm = new FormData(event.target);
	const product = Object.fromEntries(dataForm);
	socket.emit('newProduct', product);

	socket.on('mensajeProductoCreado', (mensaje) => {
		Swal.fire({
			title: 'Producto creado',
		});

	})
	event.target.reset()

});

