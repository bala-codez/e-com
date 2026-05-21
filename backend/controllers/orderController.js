const db = require("../config/db");

exports.placeOrder = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { address } = req.body;

    const [cartItems] = await conn.query(
      `SELECT c.product_id, c.quantity, p.price, p.stock, p.name
       FROM cart c JOIN products p ON c.product_id=p.id WHERE c.user_id=?`,
      [req.user.id]
    );
    if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

    for (const item of cartItems) {
      if (item.stock < item.quantity)
        throw new Error(`Insufficient stock for "${item.name}"`);
    }

    const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const [order] = await conn.query(
      "INSERT INTO orders (user_id, total, address) VALUES (?,?,?)",
      [req.user.id, total, address]
    );

    for (const item of cartItems) {
      await conn.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)",
        [order.insertId, item.product_id, item.quantity, item.price]
      );
      await conn.query("UPDATE products SET stock=stock-? WHERE id=?", [item.quantity, item.product_id]);
    }

    await conn.query("DELETE FROM cart WHERE user_id=?", [req.user.id]);
    await conn.commit();
    res.status(201).json({ message: "Order placed", orderId: order.insertId, total });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC",
      [req.user.id]
    );
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name, p.image_url FROM order_items oi JOIN products p ON oi.product_id=p.id WHERE oi.order_id=?`,
        [order.id]
      );
      order.items = items;
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (_req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name AS user_name, u.email FROM orders o JOIN users u ON o.user_id=u.id ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db.query("UPDATE orders SET status=? WHERE id=?", [status, req.params.id]);
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
