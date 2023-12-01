import express from 'express';
import passport from 'passport'; // Asegúrate de que passport esté configurado correctamente
import { generateToken } from '../utils/jwt.js';

const sessionRouter = express.Router();

sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ mensaje: "Usuario no válido" });
        }

        // Generar Token JWT
        const token = generateToken({ 
            id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            role: req.user.role // Asegúrate de que el usuario tenga un campo 'role'
        });

        // Enviar token al cliente
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send({ mensaje: `Error al iniciar sesión ${error}` });
    }
});


export default sessionRouter;