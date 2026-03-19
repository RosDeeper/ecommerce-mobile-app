import express from 'express';

import { protect } from '../middleware/auth.js';
import { 
  addAddress,
  deleteAddress,
  getAddresses, 
  updateAddress
} from '../controllers/addressController.js';

const addressRouter = express.Router();

// User role
addressRouter.get('/', protect, getAddresses);

addressRouter.post('/', protect, addAddress);

addressRouter.put('/:id', protect, updateAddress);

addressRouter.delete('/:id', protect, deleteAddress);

export default addressRouter;
