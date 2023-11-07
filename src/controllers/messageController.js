import messageModel from '../models/messages.model.js';

const postMessage = async (req, res) => {
  try {
    const { email, message } = req.body;
    const newMessage = new messageModel({ email, message });
    await newMessage.save();
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await messageModel.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const deletedMessage = await messageModel.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    res.status(200).send("Mensaje eliminado correctamente.");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { postMessage, getMessages, deleteMessage };
