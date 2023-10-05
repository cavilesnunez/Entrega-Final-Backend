import express from 'express';
import * as userController from '../controllers/userController.js';

import passport from 'passport';

const router = express.Router();

router.get('/login', userController.showLogin); 
router.get('/register', userController.showRegister); 

router.post('/register', userController.postRegister); 
router.post('/login', userController.postLogin); 

router.get('/logout', userController.getLogout); 

router.post('/', passport.authenticate('register'), async (req, res) => {
    try {
        if(!req.user) {
            return res.status(400).send({ mensaje: "Usuario ya existente" })
        }
        return res.status(200).send({ mensaje: "Usuario creado" })  
    } catch (error) {
        res.status(500).send({ mensaje: `Error al crear usuario ${error}` })
    }
});

export default router;
