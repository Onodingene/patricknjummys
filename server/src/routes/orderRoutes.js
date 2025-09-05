import express from "express";
import { 
  createOrder, 
  fetchOrders, 
  fetchOrderById, 
  editOrder, 
  deleteOrder 
} from "../controllers/orderController.js";

const router = express.Router();

// ✅ TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ message: "Order routes are working!" });
});

// ✅ Use actual controller functions
router.post("/", createOrder);           // This will handle database operations
router.get("/", fetchOrders);            // Get all orders
router.get("/:id", fetchOrderById);      // Get single order
router.put("/:id", editOrder);           // Update order
router.delete("/:id", deleteOrder);      // Delete order

export default router;