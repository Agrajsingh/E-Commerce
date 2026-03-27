import express from 'express';
import Wishlist from '../models/Wishlist.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/wishlist
router.get('/', protect, authorize('buyer'), async (req, res) => {
  const wishlist = await Wishlist.findOne({ buyer: req.user._id }).populate('products');
  res.json(wishlist?.products || []);
});

// POST /api/wishlist/:productId  — toggle
router.post('/:productId', protect, authorize('buyer'), async (req, res) => {
  let wishlist = await Wishlist.findOne({ buyer: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ buyer: req.user._id, products: [] });

  const idx = wishlist.products.indexOf(req.params.productId);
  if (idx > -1) {
    wishlist.products.splice(idx, 1);
  } else {
    wishlist.products.push(req.params.productId);
  }
  await wishlist.save();
  res.json({ inWishlist: idx === -1 });
});

export default router;
