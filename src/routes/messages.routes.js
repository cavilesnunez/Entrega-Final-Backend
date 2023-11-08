import { Router } from 'express';
import { postMessage, getMessages, deleteMessage } from '../controllers/message.controller.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Asegúrate de importar tu middleware

const router = Router();

// Aplicar el middleware para verificar si es un usuario en la ruta de postear mensaje
router.post('/', authMiddleware.isUser, postMessage);

// Obtener y eliminar mensajes no tienen restricciones de rol en este ejemplo,
// pero podrías aplicar middleware si se requiere alguna restricción
router.get('/', getMessages);
router.delete('/:messageId', deleteMessage);

export default router;
