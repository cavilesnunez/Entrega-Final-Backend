import express from 'express';
import mongoose from 'mongoose'
import { Server } from 'socket.io';
import { engine } from 'express-handlebars'
import { __dirname } from './path.js'
import path from 'path'

import { CartManager } from './controllers/cartManager.js';
import { ProductManager } from './controllers/productManager.js';


import cartRouter from './routes/cart.routes.js';
import productsRouter from './routes/products.routes.js'
import messageRouter from './routes/messages.routes.js'
// import userRouter from './router/user.routes.js';

    const PORT = 4000;
    const app = express();

    //Server
    const server = app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });


    const io = new Server(server)


    //Middlewares
    app.use(express.json())
    app.use(express.urlencoded({ extended: true })) //URL extensas

    app.engine('handlebars', engine()) //Defino que voy a trabajar con hbs y guardo la config
    app.set('view engine', 'handlebars')
    app.set('views', path.resolve(__dirname, './views'))


    
    // MongoDB Atlas connection
    // conexión con base de datos

    mongoose
    .connect(
        'mongodb+srv://carlosfavilesn:coderhouse@cluster0.p8nailk.mongodb.net/?retryWrites=true&w=majority'
    )
    .then(() => console.log('DB conectada'))
    .catch(error => console.log(`Error en conexión a MongoDB Atlas:  ${error}`));
    app.use('/products', productsRouter)

    // mongoose.connect(process.env.MONGO_URL)
    // .then (async () => {
    //     console.log('BDD connected')
    // })
    // .catch((error) => console.log("Error connecting with MongoDB ATLAS: ", error))

    //Conexion de Socket.io
    io.on("connection", (socket) => {
        console.log("Conexion con Socket.io")

        socket.on('load', async () => {
            const products = await productManager.paginate({}, { limit: 5 })
    
            socket.emit('products', products)
        })


        socket.on('nuevoProducto', (prod) => {
            console.log(prod)
            productManager.addProduct(prod);
    
            socket.emit("mensajeProductoCreado", "El producto se creo correctamente")
            
        })


        socket.on('deleteProduct', async (productId) => {
            await productManager.findByIdAndDelete(productId)
        
            socket.emit('productDeletedMessage', "Product deleted successfully")
        })


        socket.on('mensaje', async info => {
            const { message } = info
    
            await MessageModel.create({
                message
            })
    
        const messages = await MessageModel.find()
    
            socket.emit('mensajes', messages)
        })

    })


// Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/static/realtimeproducts', express.static(path.join(__dirname, '/public')))
app.use('/static/realtimecarts', express.static(path.join(__dirname, '/public')))
app.use('/static/chat', express.static(path.join(__dirname, '/public')))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/api/messages', messageRouter)



// HBS
app.get('/static', (req, res) => {
    res.render("home", {
        pathCSS: "home",
        pathJS: "home"
    })
})


app.get('/static/realtimeproducts', (req, res) => {
    res.render("realTimeProducts", {
        pathCSS: "realTimeProducts",
        pathJS: "realTimeProducts"
    })
})

app.get('/static/realtimecarts', (req, res) => {
    res.render("realTimeCarts", {
        pathCSS: "realTimeCarts",
        pathJS: "realTimeCarts"
    })
})

app.get('/static/chat', (req, res) => {
    res.render("chat", {
        pathCSS: "chat",
        pathJS: "chat"
    })
})


    app.use(express.urlencoded({ extended: true }));

    // Registra el router de carritos en el servidor
    app.use('/api/carts', cartRouter);

    const productFilePath = 'src/models/productos.json';
    const cartFilePath = 'src/models/cart.json';

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

