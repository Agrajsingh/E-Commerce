import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create a new order (pre-payment)
// @route   POST /api/orders
// @access  Private (Buyer)
export const createOrder = async (req, res) => {
  const { items, shippingAddress, razorpayOrderId } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }

  // Validate stock and calculate total
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
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private (Buyer)
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id }).sort('-createdAt');
  res.json(orders);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product', 'name images');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const isBuyer = order.buyer.toString() === req.user._id.toString();
  // Check if current user is the buyer or one of the sellers (simplified for now to just buyer check)
  if (!isBuyer) return res.status(403).json({ message: 'Not authorized' });

  res.json(order);
};

// @desc    Update order status (Seller)
// @route   PUT /api/orders/:id/status
// @access  Private (Seller)
export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const hasItem = order.items.some((i) => i.seller?.toString() === req.user._id.toString());
  if (!hasItem) return res.status(403).json({ message: 'Not authorized' });

  order.orderStatus = req.body.status;
  await order.save();
  res.json(order);
};
