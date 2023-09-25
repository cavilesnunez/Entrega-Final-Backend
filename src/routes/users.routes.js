import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/login', userController.showLogin); 
router.get('/register', userController.showRegister); 

router.post('/register', userController.postRegister); 
router.post('/login', userController.postLogin); 

router.get('/logout', userController.getLogout); 

export default router;
