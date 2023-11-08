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
} from '../controllers/cart.controller.js';
import cartModel from '../models/carts.model.js'; // Importa el modelo de carrito
import productModel from '../models/products.model.js'; // Importa el modelo de producto
import ticket from '../models/ticket.model.js'; // Importa el modelo de Ticket
import authMiddleware from '../middleware/authMiddleware.js'; // Asegúrate de que la ruta de importación sea correcta

const router = express.Router();

// Suponiendo que cualquier usuario puede crear un carrito
router.post('/', authMiddleware.isUser, createCart);

// Solo usuarios pueden agregar productos al carrito
router.post('/:cid/products/:pid', authMiddleware.isUser, addProductToCart);

// Suponiendo que obtener información del carrito puede ser realizada por cualquier usuario con el rol 'user'
router.get('/:cid', authMiddleware.isUser, getCartById);
router.get('/:cid/products', authMiddleware.isUser, getProductsInCart);

// Actualizaciones y borrado solo pueden ser realizadas por usuarios
router.put('/:cid', authMiddleware.isUser, updateCart);
router.put('/:cid/products/:pid', authMiddleware.isUser, updateProductQuantityInCart);
router.delete('/:cid/products/:pid', authMiddleware.isUser, deleteProductFromCart);
router.delete('/:cid', authMiddleware.isUser, clearCart);

// Endpoint para finalizar la compra del carrito
router.post('/:cid/purchase', authMiddleware.isUser, async (req, res) => {
    const cartId = req.params.cid;
    try {
      // Obtener el carrito y sus productos
      const cart = await cartModel.findById(cartId).populate('products.id_prod');
      if (!cart) {
        return res.status(404).send('Carrito no encontrado.');
      }
  
      let totalAmount = 0;
      const unavailableProducts = [];
      const purchasedProductIds = [];
  
      // Verificar el stock de cada producto
      for (const item of cart.products) {
        const product = await productModel.findById(item.id_prod);
        if (product.stock < item.quantity) {
          // Producto no tiene suficiente stock
          unavailableProducts.push({ productId: product.id, quantity: item.quantity });
        } else {
          // Si hay stock, se suma al total
          totalAmount += item.quantity * product.price;
          purchasedProductIds.push(product.id);
        }
      }
  
      // Si hay productos no disponibles, actualizar el carrito para eliminar los que se compraron
      if (unavailableProducts.length > 0) {
        // Actualizar el carrito para eliminar productos comprados
        await cartModel.findByIdAndUpdate(cartId, {
          $pull: { products: { id_prod: { $in: purchasedProductIds } } }
        });
  
        return res.status(400).json({
          message: 'No hay suficiente stock para algunos productos, la compra de estos productos no se realizó',
          unavailableProducts
        });
      }
  
      // Si todos los productos están disponibles, actualizar el stock y generar un ticket
      for (const item of cart.products) {
        await productModel.findByIdAndUpdate(item.id_prod, {
          $inc: { stock: -item.quantity }
        });
      }
  
      // Crear el ticket
      const newTicket = new Ticket({
        amount: totalAmount,
        purchaser: req.user.email, // Asegúrate de obtener el correo electrónico del usuario de la sesión
        // El código se autogenerará como se define en el modelo de Ticket
      });
  
      const savedTicket = await newTicket.save();
  
      // Limpia el carrito ya que todos los productos fueron comprados
      await cartModel.findByIdAndUpdate(cartId, { $set: { products: [] } });
  
      // Aquí puedes implementar cualquier otra lógica necesaria para finalizar la compra
      // ...
  
      // Enviar respuesta exitosa
      return res.status(201).json({
        message: 'Compra realizada con éxito',
        ticket: savedTicket
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al procesar la compra.');
    }
  });
  


export default router;
