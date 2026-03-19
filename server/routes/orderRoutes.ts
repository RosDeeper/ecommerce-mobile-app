import express from 'express';

import { authorize, protect } from '../middleware/auth.js';
import { 
  createOrder,
  getAllOrders,
  getOrderDetails,
  getOrders, 
  updateOrderStatus
} from '../controllers/orderController.js';

const orderRouter = express.Router();

// User role
orderRouter.get('/', protect, getOrders)

orderRouter.get('/:id', protect, getOrderDetails);

orderRouter.post('/', protect, createOrder);

orderRouter.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

orderRouter.get('/admin/all', protect, authorize('admin'), getAllOrders);

export default orderRouter;
