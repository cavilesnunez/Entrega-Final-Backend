import userModel from '../models/users.model.js';
import {logger} from '../utils/logger.js';


export const showLogin = (req, res) => {
    if (req.session.user) {
        logger.info('Usuario ya autenticado, redirigiendo a la página de inicio');
        res.redirect('/');
    } else {
        res.render('login');
    }
};

export const showRegister = (req, res) => {
    if (req.session.user) {
        logger.info('Usuario ya autenticado, redirigiendo a la página de inicio');
        res.redirect('/');
    } else {
        res.render('register');
    }
};

export const postRegister = async (req, res) => {
    const { email, password, first_name, last_name, age } = req.body;
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            logger.warning(`Intento de registro con email ya existente: ${email}`);
            return res.render('register', { error: 'El correo electrónico ya está registrado' });
        }

        const user = new userModel({ email, password, first_name, last_name, age });
        await user.save();

        logger.info(`Nuevo usuario registrado: ${user._id}`);
        req.session.user = user;
        res.cookie('userSession', user._id, { signed: true });
        res.redirect('/');
    } catch (error) {
        logger.error(`Error en postRegister: ${error}`);
        res.status(500).send('Error interno del servidor');
    }
};

export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email }).exec();
        if (user && password === user.password) {
            logger.info(`Usuario autenticado: ${user._id}`);
            req.session.user = user;
            res.cookie('userSession', user._id, { signed: true });
            res.redirect('/');
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
    req.session.destroy((err) => {
        if (err) {
            logger.error(`Error al cerrar sesión: ${err}`);
            res.redirect('/users/profile');
        } else {
            logger.info('Usuario ha cerrado sesión');
            res.clearCookie(req.app.get('cookieName'));
            res.redirect('/');
        }
    });
};
