    import express from 'express';
    import { CartManager } from '../controllers/cartManager.js';

    const cartRouter = express.Router();

    // Obtiene todos los carritos
    cartRouter.get('/', async (req, res) => {
    const carts = await CartManager.getCarts();
    res.send(carts);
    });

    // Obtiene un carrito por su id
    cartRouter.get('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid, 10);
    const cart = await CartManager.getCartById(cid);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
    });

    // Crea un nuevo carrito
    cartRouter.post('/', async (req, res) => {
    const cart = await CartManager.createCart();
    res.json(cart);
    });

    // Agrega un producto a un carrito
    cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid, 10);
    const pid = parseInt(req.params.pid, 10);
    const product = await productManager.getProductById(pid);
    if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
    }
    const cart = await CartManager.getCartById(cid);
    if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
    }
    cart.products.push({
        id: product.id,
        quantity: 1, // Inicializamos la cantidad en 1
    });
    await CartManager.updateCart(cart);
    res.json(cart);
    });

    // Actualiza la cantidad de un producto en un carrito
    cartRouter.put('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid, 10);
    const pid = parseInt(req.params.pid, 10);
    const cart = await CartManager.getCartById(cid);
    if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
    }
    const productIndex = cart.products.findIndex(
        cart => cart.id === pid
    );
    if (productIndex === -1) {
        res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        return;
    }
    const product = cart.products[productIndex];
    product.quantity = req.body.quantity;
    await CartManager.updateCart(cart);
    res.json(cart);
    });

    // Elimina un producto de un carrito
    cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid, 10);
    const pid = parseInt(req.params.pid, 10);
    const cart = await CartManager.getCartById(cid);
    if (!cart) {
        res.status(404).json({ error: 'Cart not found' });
        return;
    }
    const productIndex = cart.products.findIndex(
        cart => cart.id === pid
    );
    if (productIndex === -1) {
        res.status(404).json({ error: 'Producto not found carrito' });
        return;
    }
    cart.products.splice(productIndex, 1);
    await CartManager.updateCart(cart);
    res.json(cart);
    });

    export default cartRouter;