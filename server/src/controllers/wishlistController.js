import Wishlist from '../models/Wishlist.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private (Buyer)
export const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ buyer: req.user._id }).populate('products');
  res.json(wishlist?.products || []);
};

// @desc    Toggle product in wishlist
// @route   POST /api/wishlist/:productId
// @access  Private (Buyer)
export const toggleWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ buyer: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ buyer: req.user._id, products: [] });
  }

  const productId = req.params.productId;
  const idx = wishlist.products.indexOf(productId);
  let inWishlist = false;

  if (idx > -1) {
    wishlist.products.splice(idx, 1);
    inWishlist = false;
  } else {
    wishlist.products.push(productId);
    inWishlist = true;
  }

  await wishlist.save();
  res.json({ inWishlist });
};
