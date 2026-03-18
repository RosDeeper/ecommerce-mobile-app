import cors from "cors";
import express, { Request, Response } from 'express';
import { clerkMiddleware } from '@clerk/express';
import "dotenv/config";

import connectDB from './config/db.js';
import { clerkWebhook } from './controllers/webhooks.js';
import makeAdmin from './scripts/makeAdmin.js';
import productRouter from "./routes/productRoutes.js";

const app = express();

// Connect to MongoDB
await connectDB();

app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhook);

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Server is Live!');
});

// App route api
app.use('/api/product', productRouter);

await makeAdmin();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
