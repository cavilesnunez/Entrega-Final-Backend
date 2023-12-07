// Importaciones de configuraciones y utilidades
import 'dotenv/config.js';
import express from 'express';
import passport from 'passport'; // Gestión de la autenticación
import http from 'http'; // Creación del servidor HTTP

// Importaciones de configuración personalizada
import { connectDB } from './config/db.js'; // Configuración de la base de datos
import { setupExpress } from './config/express.js'; // Configuración de Express
import { setupSession } from './config/session.js'; // Configuración de la sesión
import initializePassport from './config/passport.js'; // Configuración de Passport

// Importaciones de WebSocket
import setupWebSocket from './sockets/index.js'; // Configuración de WebSocket

// Importaciones de Routers
import mainRouter from './routes/index.js'; // Router principal
import productRouter from './routes/products.routes.js'; // Router de productos
import passwordRoutes from './routes/password.routes.js'; // Router para gestión de contraseñas
import cartsRouter from './routes/carts.routes.js'; // Router para gestión de carritos

// Middlewares
import { errorHandler } from './middleware/errorMiddleware.js'; // Middleware para manejo de errores

// Utilidades
import logger from './utils/logger.js'; // Utilidad para logging

import swaggerUiExpress from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import { __dirname } from './path.js';

// Log de inicio de aplicación
logger.info('La aplicación se está iniciando...');

// Inicialización de la base de datos
connectDB();

// Inicialización de la aplicación Express
const app = express();

// Configuración de Express y middlewares
setupExpress(app);
setupSession(app);
initializePassport();

// Inicialización de Passport para autenticación
app.use(passport.initialize());
app.use(passport.session());

// Rutas para gestión de contraseñas
app.use(passwordRoutes);

// Directorio público para archivos estáticos
app.use(express.static('./src/public'));

// Rutas principales
app.use(mainRouter);


// // Ruta para Swagger API Docs
// app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerJSDoc));
const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Documentacion del curso de Backend',
      description: 'API Backend Coderhouse',
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
}

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


// Middleware para inyectar el usuario en las respuestas si está autenticado
app.use((req, res, next) => {
  res.locals.user = req.user; // Asegúrate de que req.user esté definido por tu middleware de autenticación
  next();
});

// Rutas para productos, configuradas para responder en la ruta raíz
// app.use('/', productRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);


// Configuración del servidor HTTP y WebSocket
const server = http.createServer(app);
const io = setupWebSocket(server);

// Iniciar el servidor escuchando en el puerto definido en las variables de entorno o 4000 por defecto
const port = process.env.PORT || 4000;
server.listen(port, () => {
  logger.info(`Servidor escuchando en http://localhost:${port}`);
});

// Middleware para manejo de errores
app.use(errorHandler);

// Exportación del objeto io de WebSocket para su uso en otros módulos si es necesario
export { io };
