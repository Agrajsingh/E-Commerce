import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews/:productId
router.get('/:productId', async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('buyer', 'name avatar')
    .sort('-createdAt');
  res.json(reviews);
});

// POST /api/reviews/:productId  — buyer only
router.post('/:productId', protect, authorize('buyer'), async (req, res) => {
  const { rating, comment } = req.body;
  const existing = await Review.findOne({ product: req.params.productId, buyer: req.user._id });
  if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

  const review = await Review.create({
    product: req.params.productId,
    buyer: req.user._id,
    rating,
    comment,
  });

  // Recalculate product rating
  const all = await Review.find({ product: req.params.productId });
  const avg = all.reduce((sum, r) => sum + r.rating, 0) / all.length;
  await Product.findByIdAndUpdate(req.params.productId, { rating: avg.toFixed(1), numReviews: all.length });

  await review.populate('buyer', 'name avatar');
  res.status(201).json(review);
});

export default router;
