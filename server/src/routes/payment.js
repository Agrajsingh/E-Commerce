import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

let razorpay;
function getRazorpay() {
  if (!razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
    }
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
}

// POST /api/payment/create-order
router.post('/create-order', protect, authorize('buyer'), async (req, res) => {
  const { amount } = req.body; // in rupees
  const options = {
    amount: Math.round(amount * 100), // paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };
  const order = await getRazorpay().orders.create(options);
  res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
});

// POST /api/payment/verify
router.post('/verify', protect, authorize('buyer'), async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSig !== razorpaySignature) {
    return res.status(400).json({ message: 'Invalid payment signature' });
  }

  // Update order payment info and reduce stock
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.paymentInfo = {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    status: 'paid',
  };
  order.orderStatus = 'processing';
  await order.save();

  // Reduce stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  res.json({ message: 'Payment verified', order });
});

export default router;
