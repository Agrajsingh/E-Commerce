import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// POST /api/orders  — buyer creates order (pre-payment)
router.post('/', protect, authorize('buyer'), async (req, res) => {
  const { items, shippingAddress, razorpayOrderId } = req.body;

  // Validate stock
  let totalPrice = 0;
  const enrichedItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });
    if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    enrichedItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price,
      quantity: item.quantity,
      seller: product.seller,
    });
    totalPrice += product.price * item.quantity;
  }

  const order = await Order.create({
    buyer: req.user._id,
    items: enrichedItems,
    shippingAddress,
    totalPrice,
    paymentInfo: { razorpayOrderId, status: 'pending' },
  });
  res.status(201).json(order);
});

// GET /api/orders/my  — buyer's order history
router.get('/my', protect, authorize('buyer'), async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id }).sort('-createdAt');
  res.json(orders);
});

// GET /api/orders/:id  — order detail
router.get('/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product', 'name images');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  // Only buyer or seller of an item can view
  const isBuyer = order.buyer.toString() === req.user._id.toString();
  if (!isBuyer) return res.status(403).json({ message: 'Not authorized' });
  res.json(order);
});

// PUT /api/orders/:id/status  — seller updates order status
router.put('/:id/status', protect, authorize('seller'), async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  // Check if this seller has items in the order
  const hasItem = order.items.some((i) => i.seller?.toString() === req.user._id.toString());
  if (!hasItem) return res.status(403).json({ message: 'Not authorized' });

  order.orderStatus = req.body.status;
  await order.save();
  res.json(order);
});

export default router;
