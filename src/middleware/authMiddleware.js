import logger from '../utils/logger.js';

const authMiddleware = {
  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      logger.info(`Acceso de administrador concedido al usuario: ${req.user.id}`);
      next();
    } else {
      logger.warning(`Intento de acceso de administrador denegado: Usuario ${req.user ? req.user.id : 'no identificado'}`);
      res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
  },

  isUser: (req, res, next) => {
    if (req.user && req.user.role === 'user') {
      logger.info(`Acceso de usuario concedido al usuario: ${req.user.id}`);
      next();
    } else {
      logger.warning(`Intento de acceso de usuario denegado: Usuario ${req.user ? req.user.id : 'no identificado'}`);
      res.status(403).json({ message: 'Acceso denegado. Se requiere rol de usuario.' });
    }
  },

  isPremium: (req, res, next) => {
    if (req.user && req.user.role === 'premium') {
      logger.info(`Acceso premium concedido al usuario: ${req.user.id}`);
      next();
    } else {
      logger.warning(`Intento de acceso premium denegado: Usuario ${req.user ? req.user.id : 'no identificado'}`);
      res.status(403).json({ message: 'Acceso denegado. Se requiere rol premium.' });
    }
  },
};

export default authMiddleware;

