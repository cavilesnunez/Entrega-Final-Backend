    import express from 'express';
    import { CartManager } from './controllers/cartManager.js';
    import { ProductManager } from './controllers/productManager.js';
    import cartRouter from './routes/cart.routes.js';

    const app = express();
    const PORT = 5000;

    app.use(express.urlencoded({ extended: true }));

    // Registra el router de carritos en el servidor
    app.use('/api/carts', cartRouter);

    const productFilePath = 'src/models/productos.txt';
    const cartFilePath = 'src/models/cart.txt';

    const productManager = new ProductManager(productFilePath);
    const cartManager = new CartManager(cartFilePath);

    app.get('/', (req, res) => {
    res.send('Home');
    });

    // Obtiene todos los productos
    app.get('/products', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 0;

    try {
        const products = await productManager.getProducts(limit);
        res.send(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
    });

    // Obtiene un producto por su id
    app.get('/products/:id', async (req, res) => {
    const pid = parseInt(req.params.id, 10);

    try {
        const product = await productManager.getProductById(pid);
        if (product) {
        res.json(product);
        } else {
        res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
    });

    // Crea un nuevo producto
    app.post('/products', async (req, res) => {
    const productData = req.body;

    try {
        const newProduct = await productManager.addProduct(productData);
        res.status(201).json({ message: 'Producto agregado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
    });

    // Actualiza un producto
    app.put('/products/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid, 10);
    const updatedData = req.body;

    try {
        const product = await productManager.getProductById(pid);
        if (product) {
        await productManager.updateProduct(pid, updatedData);
        res.status(200).json({ message: 'Producto actualizado' });
        } else {
        res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
    });

    // Elimina un producto
    app.delete('/products/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid, 10);

    try {
        const product = await productManager.getProductById(pid);
        if (product) {
        await productManager.deleteProduct(pid);
        res.status(200).json({ message: 'Producto eliminado' });
        } else {
        res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
    });

    app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    });