import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('buyer', 'name avatar')
    .sort('-createdAt');
  res.json(reviews);
};

// @desc    Add a review for a product
// @route   POST /api/reviews/:productId
// @access  Private (Buyer)
export const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const existing = await Review.findOne({ product: req.params.productId, buyer: req.user._id });
  if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

  const review = await Review.create({
    product: req.params.productId,
    buyer: req.user._id,
    rating,
    comment,
  });

  // Update product numReviews and avg rating
  const allReviews = await Review.find({ product: req.params.productId });
  const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await Product.findByIdAndUpdate(req.params.productId, { rating: avg.toFixed(1), numReviews: allReviews.length });

  await review.populate('buyer', 'name avatar');
  res.status(201).json(review);
};
