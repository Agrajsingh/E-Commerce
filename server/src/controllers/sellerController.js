import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get seller dashboard statistics
// @route   GET /api/seller/dashboard
// @access  Private (Seller)
export const getDashboardStats = async (req, res) => {
  const productsCount = await Product.countDocuments({ seller: req.user._id });

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
  res.json({ products: productsCount, totalOrders, totalRevenue, recentOrders: recent });
};

// @desc    Get seller's orders
// @route   GET /api/seller/orders
// @access  Private (Seller)
export const getSellerOrders = async (req, res) => {
  const orders = await Order.find({ 'items.seller': req.user._id })
    .populate('buyer', 'name email')
    .sort('-createdAt');
  res.json(orders);
};

// @desc    Get seller's products
// @route   GET /api/seller/products
// @access  Private (Seller)
export const getSellerProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort('-createdAt');
  res.json(products);
};
