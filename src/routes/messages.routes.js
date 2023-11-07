import { Router } from 'express';
import { postMessage, getMessages, deleteMessage } from '../controllers/messageController.js';

const router = Router();

router.post('/', postMessage);
router.get('/', getMessages);
router.delete('/:messageId', deleteMessage);

export default router;
