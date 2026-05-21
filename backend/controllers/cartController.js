const db = require("../config/db");

exports.getCart = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.quantity, p.id AS product_id, p.name, p.price, p.image_url, p.stock
       FROM cart c JOIN products p ON c.product_id=p.id WHERE c.user_id=?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    await db.query(
      `INSERT INTO cart (user_id, product_id, quantity) VALUES (?,?,?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.user.id, product_id, quantity]
    );
    res.json({ message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      await db.query("DELETE FROM cart WHERE id=? AND user_id=?", [req.params.id, req.user.id]);
    } else {
      await db.query("UPDATE cart SET quantity=? WHERE id=? AND user_id=?", [quantity, req.params.id, req.user.id]);
    }
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    await db.query("DELETE FROM cart WHERE id=? AND user_id=?", [req.params.id, req.user.id]);
    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await db.query("DELETE FROM cart WHERE user_id=?", [req.user.id]);
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
