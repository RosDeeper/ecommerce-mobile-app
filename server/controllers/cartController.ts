import { Request, Response } from "express";

import Cart from "../models/Cart.js";

// Get user cart
// GET /api/cart
export const getCart = async (req: Request, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price stock');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({ success: true, data: cart });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add item to cart
// POST /api/cart/add
export const addToCart = async (req: Request, res: Response) => {

};

// Update cart item quantity
// PUT /api/cart/item/:productId
export const updateCartItem = async (req: Request, res: Response) => {

};

// Remove item from cart
// DELETE /api/cart/item/:productId
export const removeCartItem = async (req: Request, res: Response) => {

};

// Clear cart
// DELETE /api/cart
export const clearCart = async (req: Request, res: Response) => {

};
