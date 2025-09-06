import db from "../config/database.js";

export const addOrder = async (name, house_address, city, state, email, phone_number, amount, order_note, payment_reference, order_type) => {
  const sanitizedData = [
    name?.trim() || null,
    house_address?.trim() || null,
    city?.trim() || null,
    state?.trim() || null,
    email?.trim().toLowerCase() || null,
    phone_number?.replace(/[\s-]/g, '') || null,
    Number(amount).toFixed(2),
    order_note?.trim() || null,
    payment_reference || null, // New field
    order_type || "standard", // Default to "standard" if not provided
  ];

  console.log("addOrder sanitized data:", sanitizedData);

  try {
    const [result] = await db.execute(
      `INSERT INTO orders 
        (name, house_address, city, state, email, phone_number, amount, order_note, payment_reference, order_type, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      sanitizedData
    );
    return result;
  } catch (error) {
    console.error("addOrder error:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    throw error;
  }
};

export const getOrders = async () => {
  return db.execute("SELECT * FROM orders ORDER BY created_at DESC");
};

export const getOrderById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM orders WHERE id = ?", [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const updateOrder = async (id, name, house_address, city, state, email, phone_number, amount, order_note, payment_reference, order_type) => {
  const sanitizedData = [
    name?.trim() || null,
    house_address?.trim() || null,
    city?.trim() || null,
    state?.trim() || null,
    email?.trim().toLowerCase() || null,
    phone_number?.replace(/[\s-]/g, '') || null,
    Number(amount).toFixed(2),
    order_note?.trim() || null,
    payment_reference || null,
    order_type || "standard",
    id
  ];

  return db.execute(
    `UPDATE orders 
     SET name = ?, house_address = ?, city = ?, state = ?, email = ?, phone_number = ?, amount = ?, order_note = ?, payment_reference = ?, order_type = ?
     WHERE id = ?`,
    sanitizedData
  );
};

export const removeOrder = async (id) => {
  return db.execute("DELETE FROM orders WHERE id = ?", [id]);
};