import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

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

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private (Buyer)
export const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };
  const order = await getRazorpay().orders.create(options);
  res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private (Buyer)
export const verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSig !== razorpaySignature) {
    return res.status(400).json({ message: 'Invalid payment signature' });
  }

  // Update order status and reduce stock
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  // Prevent double payment verification
  if (order.paymentInfo.status === 'paid') {
     return res.json({ message: 'Payment already verified', order });
  }

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
};
