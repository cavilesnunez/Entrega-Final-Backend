// authMiddleware.js

const authMiddleware = {
    // Middleware para verificar si el usuario es administrador
    isAdmin: (req, res, next) => {
      if (req.user && req.user.role === 'admin') {
        next(); // Si es admin, procede al siguiente middleware o al controlador
      } else {
        res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
      }
    },
  
    // Middleware para verificar si el usuario es un usuario normal
    isUser: (req, res, next) => {
      if (req.user && req.user.role === 'user') {
        next(); // Si es usuario, procede al siguiente middleware o al controlador
      } else {
        res.status(403).json({ message: 'Acceso denegado. Se requiere rol de usuario.' });
      }
    },
  };
  
  export default authMiddleware;
  