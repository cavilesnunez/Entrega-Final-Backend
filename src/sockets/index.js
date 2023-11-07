import { Server } from 'socket.io';
import productModel from '../models/products.model.js';
import messageModel from '../models/messages.model.js';

const setupWebSocket = (server) => {
    const io = new Server(server, {
        path: '/socket.io'
    });

    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        // Aquí irían todos los manejadores de eventos de Socket.IO
        socket.on('createProduct', async (productData) => {
            // ... manejo de evento createProduct
            try {
                const newProduct = await productModel.create(productData);
                io.emit('productCreated', newProduct);
            } catch (error) {
                console.error("Error al crear el producto:", error);
            }

        });

        socket.on('deleteProduct', async (productId) => {
            // ... manejo de evento deleteProduct
            try {
                await productModel.findByIdAndDelete(productId);
                io.emit('productDeleted', productId);
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
            }
        });

        socket.on('updateProduct', async (updatedProductData) => {
            // ... manejo de evento updateProduct
            try {
                const { productId, updatedFields } = updatedProductData;
                const updatedProduct = await productModel.findByIdAndUpdate(
                    productId,
                    updatedFields,
                    { new: true }
                );
                io.emit('productUpdated', updatedProduct);
            } catch (error) {
                console.error("Error al actualizar el producto:", error);
            }
        });

        // No olvides manejar la desconexión
        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });

    return io;
}

export default setupWebSocket;
