import { Router } from 'express';
import productRoutes from './products.routes.js';
import cartRoutes from './carts.routes.js';
import userRoutes from './users.routes.js';
import sessionRoutes from './sessions.routes.js';
import messageRoutes from './messages.routes.js';
import ticketsRoutes from './tickets.routes.js';


const router = Router();

router.use('/', productRoutes);
router.use('/api/products', productRoutes);
router.use('/api/carts', cartRoutes);
router.use('/users', userRoutes);
router.use('/api/sessions', sessionRoutes);
router.use('/api/messages', messageRoutes);
router.use('/api/tickets', ticketsRoutes);

export default router;
