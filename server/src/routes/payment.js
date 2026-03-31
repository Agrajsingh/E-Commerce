import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', protect, authorize('buyer'), createRazorpayOrder);
router.post('/verify', protect, authorize('buyer'), verifyPayment);

export default router;

