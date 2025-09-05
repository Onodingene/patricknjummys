/models/cart.js

import db from "../config/database.js";

export const addToCart = async (userId, title, price, quantity) => {
  return db.execute(
    "INSERT INTO cart (user_id, title, price, quantity) VALUES (?, ?, ?, ?)",
    [userId, title, price, quantity]
  );
};

export const getCart = async (userId) => {
  const [rows] = await db.execute("SELECT * FROM cart WHERE user_id = ?", [
    userId,
  ]);
  return rows;
};

export const updateCartItem = async (itemId, quantity) => {
  return db.execute("UPDATE cart SET quantity = ? WHERE id = ?", [
    quantity,
    itemId,
  ]);
};

export const removeCartItem = async (itemId) => {
  return db.execute("DELETE FROM cart WHERE id = ?", [itemId]);
};