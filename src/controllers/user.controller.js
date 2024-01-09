import userModel from '../models/users.model.js';
import logger from '../utils/logger.js';
import { generateToken } from '../utils/jwt.js';
import { createHash, validatePassword } from '../utils/bcrypt.js'; // Asegúrate de importar estas funciones

export const showLogin = (req, res) => {
    res.render('login');
};

export const showRegister = (req, res) => {
    res.render('register');
};

export const postRegister = async (req, res) => {
    const { email, password, first_name, last_name, age } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ message: 'El email ya está registrado.' });
        }

        // Encriptar la contraseña
        const hashedPassword = createHash(password);

        const user = new userModel({ email, password: hashedPassword, first_name, last_name, age });
        await user.save();

        logger.info(`Nuevo usuario registrado: ${user._id}`);
        const token = generateToken({ id: user._id, email: user.email, role: user.role });
        res.status(201).send({ token });
    } catch (error) {
        logger.error(`Error en postRegister: ${error}`);
        res.status(500).send({ message: 'Error al registrar el usuario' });
    }
};

export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email }).exec();
        if (user && validatePassword(password, user.password)) {
            logger.info(`Usuario autenticado: ${user._id}`);
            const token = generateToken({ id: user._id, email: user.email, role: user.role });
            
            res.status(200).send({ token });
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
    res.status(200).send({ mensaje: 'Cierre de sesión exitoso. Por favor, elimine el token del cliente.' });
};
