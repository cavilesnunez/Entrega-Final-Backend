import userModel from '../models/users.model.js';
import logger from '../utils/logger.js';
import {generateToken} from '../utils/jwt.js';


export const showLogin = (req, res) => {
    res.render('login');
};

export const showRegister = (req, res) => {
    res.render('register');
};

export const postRegister = async (req, res) => {
    // ... el resto de tu código ...

    const user = new userModel({ email, password, first_name, last_name, age });
    await user.save();

    logger.info(`Nuevo usuario registrado: ${user._id}`);
    const token = generateToken({ id: user._id, email: user.email, role: user.role }); // Ajusta según tu modelo de usuario
    res.status(200).send({ token }); // Envía el token al cliente
};

export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email }).exec();
        if (user && password === user.password) {
            logger.info(`Usuario autenticado: ${user._id}`);
            const token = generateToken({ id: user._id, email: user.email, role: user.role }); // Ajusta según tu modelo de usuario
            res.status(200).send({ token }); // Envía el token al cliente
        } else {
            logger.warning('Intento de login fallido');
            res.render('login', { error: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        logger.error(`Error en postLogin: ${error}`);
        res.status(500).send('Error interno del servidor');
    }
};

export const getLogout = (req, res) => {
    logger.info('Usuario ha cerrado sesión');
    // Simplemente informa al cliente que elimine el token almacenado
    res.status(200).send({ mensaje: 'Cierre de sesión exitoso. Por favor, elimine el token del cliente.' });
};
