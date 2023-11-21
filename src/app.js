// Importaciones de configuraciones y utilidades
import 'dotenv/config.js'
import express from 'express';
import { engine } from 'express-handlebars';
import http from 'http';
import passport from 'passport'; // Asegúrate de importar passport
import { connectDB } from './config/db.js';
import { setupExpress } from './config/express.js';
import { setupSession } from './config/session.js';
import initializePassport from './config/passport.js';
import setupWebSocket from './sockets/index.js';
import mainRouter from './routes/index.js';
// import { renderProducts } from './controllers/product.controller.js'; // Asegúrate de que esta función esté definida en este archivo
import { errorHandler } from './middleware/errorMiddleware.js';
import productRouter from './routes/products.routes.js'; // Asegúrate de importar el router de productos

//Logger
import logger from './utils/logger.js';

logger.info('La aplicación se está iniciando...');


// Inicialización de la aplicación y la base de datos
connectDB();

const app = express();



// Configuración de Express y middlewares
setupExpress(app);
setupSession(app); // Llama a esta función solo una vez y después de configurar express
initializePassport();


app.use(passport.initialize());
app.use(passport.session());

// Directorio público para archivos estáticos
app.use(express.static('./src/public'));


// Rutas principales
app.use(mainRouter);

// Middleware para inyectar el usuario en el contexto de las respuestas
// app.use((req, res, next) => {
//   res.locals.user = req.session.user;
//   next();
// });

// // Punto de terminación raíz que muestra productos
// app.get('/', renderProducts);
// Usar el router de productos para la ruta raíz
app.use('/', productRouter); 

// Configuración del servidor HTTP y WebSocket
const server = http.createServer(app);
const io = setupWebSocket(server);

// Iniciar el servidor
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


app.use(errorHandler);


export { io };
