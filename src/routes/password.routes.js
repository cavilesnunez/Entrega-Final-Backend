import express from 'express';
import passwordController from '../controllers/password.controller.js';

const { forgotPassword, resetPassword } = passwordController;



const router = express.Router();

// Ruta para solicitar el reinicio de contraseña
router.post('/forgot', forgotPassword);

// Ruta para manejar el restablecimiento de la contraseña
// usando el token que se envió por correo electrónico
router.post('/reset/:token', resetPassword);

// Exportar el router
export default router;
