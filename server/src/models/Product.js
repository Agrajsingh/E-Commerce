import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ public_id: String, url: String }],
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food', 'Other'],
    },
    stock: { type: Number, required: true, default: 0, min: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Full-text search index
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
