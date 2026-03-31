import express from 'express';
import { getProductReviews, addReview } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/:productId', getProductReviews);
router.post('/:productId', protect, authorize('buyer'), addReview);

export default router;

