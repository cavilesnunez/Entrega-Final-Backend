import express from 'express';
import {
    createCart,
    addProductToCart,
    getCartById,
    getProductsInCart,
    updateProductQuantityInCart,
    deleteProductFromCart,
    clearCart,
    updateCart,
} from '../controllers/cartController.js';

const router = express.Router();

router.post('/', createCart);
router.post('/:cid/products/:pid', addProductToCart);
router.get('/:cid', getCartById);
router.get('/:cid/products', getProductsInCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantityInCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.delete('/:cid', clearCart);

export default router;
