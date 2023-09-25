import 'dotenv/config'
import mongoose from 'mongoose';
import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';
import MongoDBStore from 'connect-mongodb-session';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import productRoutes from './routes/products.routes.js';
import cartRoutes from './routes/cart.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import productModel from './models/products.model.js';
import messageModel from './models/messages.model.js';
import userRoutes from './routes/users.routes.js';
import { renderProducts } from './controllers/productController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4000;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conexión exitosa a MongoDB.');
});

app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));

const MongoDBSessionStore = MongoDBStore(session);

const store = new MongoDBSessionStore({
    uri: process.env.MONGO_URL,
    collection: "session",
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { 
        secure: false, 
        maxAge: 60000
    }
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.get('/', renderProducts);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.use('/users', userRoutes);

app.get('/users/profile', (req, res) => {
    res.render('profile', { user: req.session.user });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts');
});

app.post('/api/messages', async (req, res) => {
    try {
        const { email, message } = req.body;
        const newMessage = new messageModel({ email, message });
        await newMessage.save();
        res.json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/messages', async (req, res) => {
    try {
        const messages = await messageModel.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/messages/:messageId', async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const deletedMessage = await messageModel.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }

        res.status(200).send("Mensaje eliminado correctamente.");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const server = http.createServer(app);
const io = new Server(server, {
    path: '/socket.io'
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('createProduct', async (productData) => {
        try {
            const newProduct = await productModel.create(productData);
            io.emit('productCreated', newProduct);
        } catch (error) {
            console.error("Error al crear el producto:", error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await productModel.findByIdAndDelete(productId);
            io.emit('productDeleted', productId);
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    });

    socket.on('updateProduct', async (updatedProductData) => {
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
});

server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

export { io };