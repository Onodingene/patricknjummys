import express from "express";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";
import customCartRoutes from "./routes/customCartRoutes.js";


const app = express();

// ✅ MIDDLEWARE (must be before routes)
app.use(cors());
app.use(express.json()); // parses JSON body
// app.use(express.urlencoded({ extended: true })); // handles form submissions

// ✅ ROUTES
app.use("/api/orders", orderRoutes);
app.use("/api/custom-cart", customCartRoutes); // Changed from "/api/" to "/api/custom-cart"

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));