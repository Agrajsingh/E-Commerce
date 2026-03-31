import express from 'express';
import { createOrder, getMyOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('buyer'), createOrder);
router.get('/my', protect, authorize('buyer'), getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('seller'), updateOrderStatus);

export default router;

