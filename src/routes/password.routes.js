// src/routes/password.routes.js (o un archivo similar)

import express from 'express';
import passwordController from '../controllers/password.controller.js';

const router = express.Router();

// Ruta para mostrar el formulario de solicitud de recuperación
router.get('/forgot-password', (req, res) => {
    res.render('forgotPassword');
});

// Ruta para manejar la solicitud de recuperación
router.post('/forgot-password', passwordController.forgotPassword);

// Ruta para mostrar el formulario de restablecimiento
router.get('/reset-password/:token', (req, res) => {
    res.render('resetPassword', { token: req.params.token });
});

// Ruta para manejar el restablecimiento de contraseña
router.post('/reset-password/:token', passwordController.resetPassword);

export default router;
