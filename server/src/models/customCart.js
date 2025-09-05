// models/customCart.js
import db from "../config/database.js";

// Add a custom order
export const addCustomOrder = async (
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
  order_type = 'custom' // Default to 'custom', can be overridden to 'express'
) => {
  const sanitizedData = [
    cartId,
    inches || null,
    num_layers || null,
    num_flavors || null,
    JSON.stringify(flavors || []),
    gender?.trim() || null,
    topper_message?.trim() || null,
    parseFloat(price) || 0,
    parseInt(quantity, 10) || 1,
    decoration?.trim() || null,
    image || null,
    order_note?.trim() || null,
    order_type, // New field
  ];

  const conn = await db;
  return conn.execute(
    `INSERT INTO custom_cart
    (cart_id, inches, num_layers, num_flavors, flavors, gender, topper_message, price, quantity, decoration, image, order_note, order_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    sanitizedData
  );
};

// Get all custom orders by cart_id
export const getCustomOrders = async (cartId) => {
  const conn = await db;
  const [rows] = await conn.execute(
    "SELECT * FROM custom_cart WHERE cart_id = ? ORDER BY created_at DESC",
    [cartId]
  );
  return rows;
};

// Update a custom order
export const updateCustomOrder = async (
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
  order_type = 'custom' // Default to 'custom'
) => {
  const sanitizedData = [
    inches || null,
    num_layers || null,
    num_flavors || null,
    JSON.stringify(flavors || []),
    gender?.trim() || null,
    topper_message?.trim() || null,
    parseFloat(price) || 0,
    parseInt(quantity, 10) || 1,
    decoration?.trim() || null,
    image?.trim() || null,
    order_note?.trim() || null,
    order_type,
    id,
  ];

  const conn = await db;
  return conn.execute(
    `UPDATE custom_cart 
     SET inches = ?, num_layers = ?, num_flavors = ?, flavors = ?, gender = ?, topper_message = ?, 
         price = ?, quantity = ?, decoration = ?, image = ?, order_note = ?, order_type = ?
     WHERE id = ?`,
    sanitizedData
  );
};

// Delete a custom order
export const removeCustomOrder = async (itemId) => {
  const conn = await db;
  return conn.execute("DELETE FROM custom_cart WHERE id = ?", [itemId]);
};