import messageModel from '../models/messages.model.js';
import logger  from '../utils/logger.js';


const postMessage = async (req, res) => {
  try {
    const { email, message } = req.body;
    const newMessage = new messageModel({ email, message });
    await newMessage.save();
    logger.info('Nuevo mensaje guardado');
    res.json(newMessage);
  } catch (error) {
    logger.error(`Error al guardar mensaje: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await messageModel.find();
    logger.info('Mensajes obtenidos exitosamente');
    res.json(messages);
  } catch (error) {
    logger.error(`Error al obtener mensajes: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const deletedMessage = await messageModel.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      logger.warning('Intento de eliminar mensaje no encontrado');
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    logger.info(`Mensaje eliminado: ID ${messageId}`);
    res.status(200).send("Mensaje eliminado correctamente.");
  } catch (error) {
    logger.error(`Error al eliminar mensaje: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export { postMessage, getMessages, deleteMessage };
