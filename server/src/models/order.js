
import db from "../config/database.js";

// Create new order
export const addOrder = async (name, house_address, city, state, email, phone_number, amount, order_note) => {
  // Sanitize inputs
  const sanitizedData = [
    name?.trim() || null,
    house_address?.trim() || null,
    city?.trim() || null,
    state?.trim() || null,
    email?.trim().toLowerCase() || null,
    phone_number?.replace(/[\s-]/g, '') || null,
    Number(amount).toFixed(2), // Ensure 2 decimal places for DECIMAL(10,2)
    order_note?.trim() || null,
  ];

  console.log("addOrder sanitized data:", sanitizedData); // Log for debugging

  try {
    const [result] = await db.execute(
      `INSERT INTO orders 
        (name, house_address, city, state, email, phone_number, amount, order_note) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      sanitizedData
    );
    return result;
  } catch (error) {
    console.error("addOrder error:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    throw error; // Re-throw to be caught in controller
  }
};

// Get all orders
export const getOrders = async () => {
  return db.execute("SELECT * FROM orders ORDER BY created_at DESC");
};

// Get single order by ID
export const getOrderById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM orders WHERE id = ?", [id]);
  return rows.length > 0 ? rows[0] : null;
};

// Update order
export const updateOrder = async (id, name, house_address, city, state, email, phone_number, amount, order_note) => {
  const sanitizedData = [
    name?.trim() || null,
    house_address?.trim() || null,
    city?.trim() || null,
    state?.trim() || null,
    email?.trim().toLowerCase() || null,
    phone_number?.replace(/[\s-]/g, '') || null,
    Number(amount).toFixed(2), // Ensure 2 decimal places
    order_note?.trim() || null,
    id
  ];

  return db.execute(
    `UPDATE orders 
     SET name = ?, house_address = ?, city = ?, state = ?, email = ?, phone_number = ?, amount = ?, order_note = ?
     WHERE id = ?`,
    sanitizedData
  );
};

// Delete order
export const removeOrder = async (id) => {
  return db.execute("DELETE FROM orders WHERE id = ?", [id]);
};
