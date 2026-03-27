import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        image: String,
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentInfo: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
