// tickets.routes.js

import { Router } from 'express';
import { createTicket, getTickets, getTicketById, updateTicket, deleteTicket } from '../controllers/ticket.controller.js';

const router = Router();

// Ruta para la creación de un ticket
router.post('/tickets', createTicket);

// Ruta para obtener todos los tickets
router.get('/tickets', getTickets);

// Ruta para obtener un ticket por su ID
router.get('/tickets/:id', getTicketById);

// Ruta para actualizar un ticket por su ID
router.put('/tickets/:id', updateTicket);

// Ruta para eliminar un ticket por su ID
router.delete('/tickets/:id', deleteTicket);

// Exportar el router para usarlo en el archivo principal de la aplicación
export default router;
