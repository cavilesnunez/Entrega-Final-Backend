const socket = io();

//const productsContainer = document.querySelector('#products-container');
const pageNumber = document.querySelector('#page-number');
const previousButton = document.querySelector('#prev-page-button');
const nextButton = document.querySelector('#next-page-button');
const mensaje = document.querySelector('#bienvenida');

let page;
let cartId;

socket.emit('load');
socket.on('products', data => {
    
	page = data.page;
	pageNumber.innerText = page;
	!data.hasPrevPage ? (previousButton.disabled = true) : (previousButton.disabled = false);
	!data.hasNextPage ? (nextButton.disabled = true) : (nextButton.disabled = false);

	const addButtons = document.querySelectorAll('.add-button');
	addButtons.forEach(button => {
		button.addEventListener('click', e => {
			const pid = e.target.id;
			const data = { pid, cartId };
			socket.emit('addProduct', data);
		});
	});
});

previousButton.addEventListener('click', () => {
	page--;
	socket.emit('previousPage', page);
});

nextButton.addEventListener('click', () => {
	page++;
	socket.emit('nextPage', page);
});

socket.on('success', cid => {
	cartId = cid;
	Swal.fire({
		title: 'Producto agregado',
	});
});
