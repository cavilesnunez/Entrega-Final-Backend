import CustomError from '../utils/customError.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Algo salió mal.' });
};
