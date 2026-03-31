import express from 'express';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('buyer'), getWishlist);
router.post('/:productId', protect, authorize('buyer'), toggleWishlist);

export default router;

