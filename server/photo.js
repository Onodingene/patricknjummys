/controllers/orderController.js

import Joi from "joi";
import {
  addOrder,
  getOrders,
  getOrderById,
  updateOrder,
  removeOrder,
} from "../models/order.js";

// Validation schema
const orderSchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters long",
  }),
  house_address: Joi.string().trim().min(5).required().messages({
    "string.empty": "Address is required",
    "string.min": "Address must be at least 5 characters long",
  }),
  city: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "City is required",
    "string.min": "City must be at least 2 characters long",
  }),
  state: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "State is required",
    "string.min": "State must be at least 2 characters long",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  phone_number: Joi.string()
    .trim()
    .min(7)
    .max(20)
    .allow("")
    .optional()
    .messages({
      "string.min": "Phone number must be at least 7 characters long",
    }),
  amount: Joi.number().min(0).required().messages({
    "number.base": "Amount is required",
    "number.min": "Amount cannot be negative",
  }),
  order_note: Joi.string().trim().allow("").optional(),
});

export const createOrder = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log for debugging

    // Check if req.body is defined
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is missing or empty",
      });
    }

    const { error, value } = orderSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    if (!value) {
      return res.status(400).json({
        message: "Validation failed: No valid data provided",
      });
    }

    const {
      name,
      house_address,
      city,
      state,
      email,
      phone_number,
      amount,
      order_note,
    } = value;

    const result = await addOrder(
      name,
      house_address,
      city,
      state,
      email,
      phone_number,
      amount,
      order_note
    );
    console.log(result);
    res.status(201).json({
      message: "Order created successfully",
      orderId: result.insertId,
    });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
};

// Get all orders
export const fetchOrders = async (req, res) => {
  // console.log(req, res);
  try {
    const orders = await getOrders();
    console.log(orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

// Get single order
export const fetchOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

// Update order
export const editOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = orderSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const {
      name,
      house_address,
      city,
      state,
      email,
      phone_number,
      amount,
      order_note,
    } = value;

    const [result] = await updateOrder(
      id,
      name,
      house_address,
      city,
      state,
      email,
      phone_number,
      amount,
      order_note
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating order", error: error.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await removeOrder(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting order", error: error.message });
  }
};