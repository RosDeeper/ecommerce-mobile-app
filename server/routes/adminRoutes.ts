import express from "express";

import { authorize, protect } from "../middleware/auth.js";
import { getDashboardStats } from "../controllers/adminController.js";

const adminRouter = express.Router();

// Admin role
adminRouter.get('/stats', protect, authorize('admin'), getDashboardStats);

export default adminRouter;
