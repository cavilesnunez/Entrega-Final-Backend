// sessions.routes.js

import express from 'express';
import passport from 'passport';
import { generateToken } from '../utils/jwt.js';

const sessionRouter = express.Router();

sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ mensaje: "Usuario no válido" });
        }

        // Generar Token JWT
        const token = generateToken({ 
            id: req.user.id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            role: req.user.role
        });

        // Imprimir el token generado en la consola del servidor
        console.log(`Token generado: ${token}`);

        // Enviar token al cliente
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send({ mensaje: `Error al iniciar sesión ${error}` });
    }
});

export default sessionRouter;
