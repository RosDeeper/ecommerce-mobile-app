import { Request, Response } from "express";

import Product from "../models/Products.js";

// Get all product
// GET api/product
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query: any = { isActive: true };

    const total = await Product.countDocuments(query);
    const products = await Product
      .find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit)); 

    res.json({
      success: true,
      data: products,
      pagination: { 
        total, 
        page: Number(page), 
        pages: Math.ceil(total / Number(limit)) 
      },
    });

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  } 
};

// Get product details
// GET api/product/:id
export const getProductDetails = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({ success: true, data: product });

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  } 
};

// Create product
// POST /api/product
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Handle file uploads

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  } 
};
