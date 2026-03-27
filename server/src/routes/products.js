import express from 'express';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload, deleteImage } from '../middleware/upload.js';

const router = express.Router();

// GET /api/products  — public, with search/filter/pagination
router.get('/', async (req, res) => {
  const { search, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
  const query = {};

  if (search) query.$text = { $search: search };
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(query).populate('seller', 'name storeName').skip(skip).limit(Number(limit)).sort('-createdAt'),
    Product.countDocuments(query),
  ]);
  res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// GET /api/products/:id  — public
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('seller', 'name storeName storeDescription');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// POST /api/products  — seller only
router.post('/', protect, authorize('seller'), upload.array('images', 5), async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const images = req.files?.map((f) => ({ public_id: f.filename, url: `/uploads/products/${f.filename}` })) || [];
  const product = await Product.create({ name, description, price, category, stock, images, seller: req.user._id });
  res.status(201).json(product);
});

// PUT /api/products/:id  — seller only (own product)
router.put('/:id', protect, authorize('seller'), upload.array('images', 5), async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.seller.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not your product' });

  const { name, description, price, category, stock, deleteImages } = req.body;
  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;
  if (category) product.category = category;
  if (stock !== undefined) product.stock = stock;

  // Delete specified old images from local storage
  if (deleteImages) {
    const ids = JSON.parse(deleteImages);
    for (const id of ids) deleteImage(id);
    product.images = product.images.filter((img) => !ids.includes(img.public_id));
  }

  if (req.files?.length) {
    const newImgs = req.files.map((f) => ({ public_id: f.filename, url: `/uploads/products/${f.filename}` }));
    product.images = [...product.images, ...newImgs];
  }

  await product.save();
  res.json(product);
});

// DELETE /api/products/:id  — seller only (own product)
router.delete('/:id', protect, authorize('seller'), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.seller.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not your product' });

  for (const img of product.images) deleteImage(img.public_id);
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
});

export default router;
