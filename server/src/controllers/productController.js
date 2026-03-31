import Product from '../models/Product.js';
import { deleteImage } from '../middleware/upload.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
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
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('seller', 'name storeName storeDescription');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Seller)
export const createProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const images = req.files?.map((f) => ({ public_id: f.filename, url: `/uploads/products/${f.filename}` })) || [];
  const product = await Product.create({ name, description, price, category, stock, images, seller: req.user._id });
  res.status(201).json(product);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Seller)
export const updateProduct = async (req, res) => {
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
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Seller)
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.seller.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not your product' });

  for (const img of product.images) deleteImage(img.public_id);
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
};
