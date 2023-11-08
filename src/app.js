// Importaciones de configuraciones y utilidades
import 'dotenv/config.js'
import express from 'express';
import http from 'http';
import passport from 'passport'; // Asegúrate de importar passport
import { connectDB } from './config/db.js';
import { setupExpress } from './config/express.js';
import { setupSession } from './config/session.js';
import initializePassport from './config/passport.js';
import setupWebSocket from './sockets/index.js';
import mainRouter from './routes/index.js';
import { renderProducts } from './controllers/product.controller.js'; // Asegúrate de que esta función esté definida en este archivo



// Inicialización de la aplicación y la base de datos
connectDB();

const app = express();

// Configuración de Express y middlewares
setupExpress(app);
setupSession(app); // Llama a esta función solo una vez y después de configurar express
initializePassport();

app.use(passport.initialize());
app.use(passport.session());

// Rutas principales
app.use(mainRouter);

// Middleware para inyectar el usuario en el contexto de las respuestas
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Punto de terminación raíz que muestra productos
app.get('/', renderProducts);

// Configuración del servidor HTTP y WebSocket
const server = http.createServer(app);
const io = setupWebSocket(server);

// Iniciar el servidor
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Exportar 'io' si es necesario para otros módulos
export { io };
