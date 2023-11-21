import Cart from '../models/carts.model.js';
import logger  from '../utils/logger.js';

export const createCart = async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        logger.info('Nuevo carrito creado');
        res.json(newCart);
    } catch (error) {
        logger.error(`Error al crear carrito: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        const cart = await Cart.findById(cartId);

        if (!cart) {
            logger.warning('Carrito no encontrado para agregar producto');
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const existingProductIndex = cart.products.findIndex(product => product.id_prod.toString() === productId);

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({
                id_prod: productId,
                quantity: quantity,
            });
        }

        const updatedCart = await cart.save();

        logger.info(`Producto agregado al carrito: Cart ID ${cartId}, Product ID ${productId}`);
        res.json(updatedCart);
    } catch (error) {
        logger.error(`Error al agregar producto al carrito: ${error.message}`);
        res.status(404).json({ error: error.message });
    }
};

export const getCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate({
            path: 'products.id_prod',
            model: 'products'
        });

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json(cart);
        logger.info(`Obteniendo carrito: ID ${req.params.cid}`);
    } catch (error) {
        logger.error(`Error al obtener carrito por ID: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const getProductsInCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate({
            path: 'products.id_prod',
            model: 'products'
        });

        if (!cart) {
            return res.status(404).json({ error: 'Carrito sin productos encontrados' });
        }

        res.json(cart.products);
        logger.info(`Obteniendo productos en carrito: ID ${req.params.cid}`);
    } catch (error) {
        logger.error(`Error al obtener productos en carrito: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const updateCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const updatedCartData = req.body;

        const updatedCart = await Cart.findByIdAndUpdate(
            cartId,
            { $set: updatedCartData },
            { new: true }
        );

        if (!updatedCart) {
            logger.warning('Carrito no encontrado para actualizar');
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json(updatedCart);
        logger.info(`Carrito actualizado: ID ${req.params.cid}`);
    } catch (error) {
        logger.error(`Error al actualizar carrito: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const updateProductQuantityInCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        const updatedCart = await Cart.findOneAndUpdate(
            { _id: cartId, "products.id_prod": productId },
            { $set: { "products.$.quantity": quantity } },
            { new: true }
        );

        if (!updatedCart) {
            logger.warning('Carrito o producto no encontrado');
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }

        res.json(updatedCart);
        logger.info(`Cantidad de producto actualizada en carrito: Cart ID ${cartId}, Product ID ${productId}`);
    } catch (error) {
        logger.error(`Error al actualizar cantidad de producto en carrito: ${error.message}`);
        res.status(404).json({ error: error.message });
    }
};

export const deleteProductFromCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await Cart.findByIdAndUpdate(
            cartId,
            {
                $pull: {
                    products: { id_prod: productId },
                },
            },
            { new: true }
        );

        if (!updatedCart) {
            logger.warning('Carrito o producto no encontrado');
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }

        res.json(updatedCart);
        logger.info(`Producto eliminado de carrito: Cart ID ${cartId}, Product ID ${productId}`);
    } catch (error) {
        logger.error(`Error al eliminar producto de carrito: ${error.message}`);
        res.status(404).json({ error: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cartId = req.params.cid;

        const updatedCart = await Cart.findByIdAndUpdate(
            cartId,
            { products: [] },
            { new: true }
        );

        if (!updatedCart) {
            logger.warning('Carrito no encontrado para limpiar');
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json(updatedCart);
        logger.info(`Carrito limpiado: ID ${req.params.cid}`);
    } catch (error) {
        logger.error(`Error al limpiar carrito: ${error.message}`);
        res.status(404).json({ error: error.message });
    }
};