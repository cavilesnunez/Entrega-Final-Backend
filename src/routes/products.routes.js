import express from 'express';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

// Rutas accesibles por cualquier usuario autenticado o no autenticado (según la lógica de tu app)
router.get('/', getProducts);
router.get('/:pid', getProductById);

// Rutas que requieren que el usuario sea un administrador
router.post('/', authMiddleware.isAdmin, addProduct);
router.put('/:pid', authMiddleware.isAdmin, updateProduct);
router.delete('/:pid', authMiddleware.isAdmin, deleteProduct);

export default router;
