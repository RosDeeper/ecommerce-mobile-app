import express from 'express';

import { 
  createProduct,
  deleteProduct,
  getProductDetails,
  getProducts, 
  updateProduct
} from '../controllers/productController.js';
import upload from '../middleware/upload.js';
import { authorize, protect } from '../middleware/auth.js';

const productRouter = express.Router();

// User role
productRouter.get('/', getProducts);

productRouter.get('/:id', getProductDetails);

// Admin role
productRouter.post('/', upload.array('images', 5), protect, authorize('admin'), createProduct);

productRouter.put('/:id', upload.array('images', 5), protect, authorize('admin'), updateProduct);

productRouter.delete('/:id', protect, authorize('admin'), deleteProduct);

export default productRouter;
