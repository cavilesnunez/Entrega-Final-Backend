// products.routes.js

import express from 'express';
import { renderProducts, getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas accesibles por cualquier usuario autenticado o no autenticado (según la lógica de tu app)
// router.get('/', getProducts);
// router.get('/:pid', getProductById);

// Rutas que requieren que el usuario sea un administrador o premium
router.post('/', [authMiddleware.isAdmin, authMiddleware.isPremium], addProduct);
router.put('/:pid', [authMiddleware.isAdmin, authMiddleware.isPremium], updateProduct);
router.delete('/:pid', [authMiddleware.isAdmin, authMiddleware.isPremium], deleteProduct);

router.get('/', renderProducts);

export default router;
