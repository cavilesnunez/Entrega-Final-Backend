import logger from '../utils/logger.js';

const getProfile = (req, res) => {
    try {
        res.render('profile', { user: req.session.user });
        logger.info('Perfil de usuario renderizado');
    } catch (error) {
        logger.error(`Error al renderizar perfil de usuario: ${error.message}`);
        res.status(500).send('Error al renderizar perfil');
    }
};
  
const getRealtimeProducts = (req, res) => {
    try {
        res.render('realtimeproducts');
        logger.info('Vista de productos en tiempo real renderizada');
    } catch (error) {
        logger.error(`Error al renderizar productos en tiempo real: ${error.message}`);
        res.status(500).send('Error al renderizar productos en tiempo real');
    }
};
  
// Exporta cualquier otro controlador relacionado con el usuario aquí
  
export { getProfile, getRealtimeProducts };
