import CustomError from '../utils/customError.js';
import {logger} from '../utils/logger.js';


export const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    logger.warning(`Error personalizado: ${err.message}`);
    return res.status(err.status).json({ error: err.message });
  } else {
    logger.error(`Error no manejado: ${err.message}`);
    return res.status(500).json({ error: 'Algo salió mal.' });
  }
};
