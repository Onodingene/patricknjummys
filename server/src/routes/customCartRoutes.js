
import express from "express";
import multer from "multer";
import {
  createCustomOrder,
  getCustomCart,
  editCustomOrder,
  deleteCustomOrder,
} from "../controllers/customCartController.js";

const router = express.Router();
const upload = multer(); // for handling image upload (memory storage)

// POST /api/custom-cart → add new custom order
router.post("/", upload.single("image"), createCustomOrder);

// GET /api/custom-cart/:cartId → fetch all custom orders for a cart
router.get("/:cartId", getCustomCart);

// PUT /api/custom-cart/:id → update a custom order
router.put("/:id", upload.single("image"), editCustomOrder);

// DELETE /api/custom-cart/:id → delete a custom order
router.delete("/:id", deleteCustomOrder);

export default router;
