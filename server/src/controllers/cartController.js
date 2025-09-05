import { addToCart, getCart, updateCartItem, removeCartItem } from "../models/cart.js";

export const addItem = async (req, res, next) => {
  try {
    const {userId, title, price, quantity} = req.body;
    await addToCart(userId, title, price, quantity);
    res.json({ success: true, message: "Item added to cart" });
  } catch (err) {
    next(err);
  }
};

export const getUserCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const [rows] = await getCart(userId);
    res.json({ success: true, cart: rows });
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    await updateCartItem(itemId, quantity);
    res.json({ success: true, message: "Cart updated" });
  } catch (err) {
    next(err);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    await removeCartItem(itemId);
    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    next(err);
  }
};
