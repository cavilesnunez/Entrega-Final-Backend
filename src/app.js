// Importaciones de configuraciones y utilidades
import config from './config/config.js';
import express from 'express';
import http from 'http';
import { connectDB } from './config/db.js';
import { setupExpress } from './config/express.js';
import { setupSession } from './config/session.js';
import setupWebSocket from './sockets/index.js';
import mainRouter from './routes/index.js';
import initializePassport from './config/passport.js';

// Crear la aplicación de express y el servidor HTTP
const app = express();
const server = http.createServer(app);

// Configuraciones y middlewares
connectDB();
setupExpress(app);
setupSession(app);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas principales
app.use(mainRouter);

// Configuración de WebSocket con Socket.IO
const io = setupWebSocket(server);

// Middleware para inyectar el usuario en el contexto de las respuestas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.get('/', renderProducts);

// Iniciar el servidor
const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

console.log(config.mongoUrl); // Usar la URL de MongoDB


// Exportar 'io' si es necesario para otros módulos
export { io };