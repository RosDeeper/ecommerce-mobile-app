import cors from "cors";
import express, { Request, Response } from 'express';
import { clerkMiddleware } from '@clerk/express';
import "dotenv/config";

import connectDB from './config/db.js';
import { clerkWebhook } from './controllers/webhooks.js';
import makeAdmin from './scripts/makeAdmin.js';
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import { seedProducts } from "./scripts/seedProducts.js";

const app = express();

// Connect to MongoDB
await connectDB();

app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhook);

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const port = process.env.PORT || 8080;

app.get('/', (req: Request, res: Response) => {
  res.send('Server is Live!');
});

// App route api
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/address', addressRouter);
app.use('/api/admin', adminRouter);

await makeAdmin();

// Seed dummy products if no products are present
// await seedProducts(process.env.MONGODB_URI as string);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
