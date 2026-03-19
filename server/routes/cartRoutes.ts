import express from 'express';

import { protect } from '../middleware/auth.js';
import { 
  addToCart,
  clearCart,
  getCart, 
  removeCartItem, 
  updateCartItem
} from '../controllers/cartController.js';

const cartRouter = express.Router();

// User role
cartRouter.get('/', protect, getCart);

cartRouter.post('/add', protect, addToCart);

cartRouter.put('/item/:productId', protect, updateCartItem);

cartRouter.delete('/item/:productId', protect, removeCartItem);

cartRouter.delete('/', protect, clearCart);

export default cartRouter;
