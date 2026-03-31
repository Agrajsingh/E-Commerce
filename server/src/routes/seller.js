import express from 'express';
import { getDashboardStats, getSellerOrders, getSellerProducts } from '../controllers/sellerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('seller'), getDashboardStats);
router.get('/orders', protect, authorize('seller'), getSellerOrders);
router.get('/products', protect, authorize('seller'), getSellerProducts);

export default router;

