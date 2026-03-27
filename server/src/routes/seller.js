import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/seller/dashboard
router.get('/dashboard', protect, authorize('seller'), async (req, res) => {
  const products = await Product.countDocuments({ seller: req.user._id });

  // Orders that contain at least one item from this seller
  const orders = await Order.find({ 'items.seller': req.user._id });
  const totalOrders = orders.length;
  let totalRevenue = 0;
  for (const order of orders) {
    if (order.paymentInfo.status === 'paid') {
      for (const item of order.items) {
        if (item.seller?.toString() === req.user._id.toString()) {
          totalRevenue += item.price * item.quantity;
        }
      }
    }
  }

  const recent = orders.slice(-5).reverse();
  res.json({ products, totalOrders, totalRevenue, recentOrders: recent });
});

// GET /api/seller/orders
router.get('/orders', protect, authorize('seller'), async (req, res) => {
  const orders = await Order.find({ 'items.seller': req.user._id })
    .populate('buyer', 'name email')
    .sort('-createdAt');
  res.json(orders);
});

// GET /api/seller/products
router.get('/products', protect, authorize('seller'), async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort('-createdAt');
  res.json(products);
});

export default router;
