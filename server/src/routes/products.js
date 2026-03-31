import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('seller'), upload.array('images', 5), createProduct);
router.put('/:id', protect, authorize('seller'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('seller'), deleteProduct);

export default router;

