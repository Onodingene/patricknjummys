// controllers/customCartController.js
import {
  addCustomOrder,
  getCustomOrders,
  updateCustomOrder,
  removeCustomOrder,
} from "../models/customCart.js";

// Add a new custom order
export const createCustomOrder = async (req, res) => {
  try {
    const {
      cartId,
      inches,
      num_layers,
      num_flavors,
      flavors,
      gender,
      topper_message,
      price,
      quantity,
      decoration,
      order_note,
      order_type = 'custom', // Default to 'custom', can be 'express' from ExpressDashboard
    } = req.body;

    // If image is uploaded (base64 or file buffer)
    const image = req.file ? req.file.buffer : null;

    const [result] = await addCustomOrder(
      cartId,
      inches,
      num_layers,
      num_flavors,
      flavors,
      gender,
      topper_message,
      price,
      quantity,
      decoration,
      image,
      order_note,
      order_type
    );

    res.status(201).json({
      message: `Custom order created successfully (type: ${order_type})`,
      orderId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating custom order", error });
  }
};

// Get all custom orders for a cart
export const getCustomCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const [orders] = await getCustomOrders(cartId);

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching custom orders", error });
  }
};

// Update a custom order
export const editCustomOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      inches,
      num_layers,
      num_flavors,
      flavors,
      gender,
      topper_message,
      price,
      quantity,
      decoration,
      order_note,
      order_type = 'custom', // Allow updating order_type
    } = req.body;

    const image = req.file ? req.file.buffer : null;

    await updateCustomOrder(
      id,
      inches,
      num_layers,
      num_flavors,
      flavors,
      gender,
      topper_message,
      price,
      quantity,
      decoration,
      image,
      order_note,
      order_type
    );

    res.status(200).json({ message: `Custom order updated successfully (type: ${order_type})` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating custom order", error });
  }
};

// Delete a custom order
export const deleteCustomOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await removeCustomOrder(id);

    res.status(200).json({ message: "Custom order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting custom order", error });
  }
};