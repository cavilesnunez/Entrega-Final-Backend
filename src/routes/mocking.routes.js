import express from 'express';
import { getMockingProducts } from '../controllers/mocking.controller.js';
// ... tus otras importaciones y configuraciones

const app = express();

// ... tus otras rutas

app.get('/mockingproducts', getMockingProducts);

// ... resto de la configuración del servidor
