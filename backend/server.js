import express from 'express';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import connectDB from "./lib/db.js";
import cookieParser from 'cookie-parser';
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";


dotenv.config();

// Connect to MongoDB

const app = express();
const PORT = process.env.PORT || 5000 ;

app.use(express.json()); // allows you to parse the body of the request when defining controllers
app.use(cookieParser()); // allows you to parse the cookies


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT);
  connectDB();
})