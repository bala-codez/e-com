const db = require("../config/db");

exports.getAll = async (req, res) => {
  try {
    const { category, search, sort = "id", page = 1, limit = 12 } = req.query;
    let where = "WHERE 1=1";
    const params = [];

    if (category) { where += " AND c.slug=?"; params.push(category); }
    if (search)   { where += " AND p.name LIKE ?"; params.push(`%${search}%`); }

    const validSort = { price_asc:"p.price ASC", price_desc:"p.price DESC", rating:"p.rating DESC", newest:"p.created_at DESC" };
    const orderBy = validSort[sort] || "p.id ASC";
    const offset  = (Number(page) - 1) * Number(limit);

    const [rows] = await db.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p LEFT JOIN categories c ON p.category_id=c.id
       ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM products p LEFT JOIN categories c ON p.category_id=c.id ${where}`,
      params
    );
    res.json({ products: rows, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p LEFT JOIN categories c ON p.category_id=c.id WHERE p.id=?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories ORDER BY name");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, price, stock, image_url, category_id } = req.body;
    const [result] = await db.query(
      "INSERT INTO products (name,description,price,stock,image_url,category_id) VALUES (?,?,?,?,?,?)",
      [name, description, price, stock, image_url, category_id]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const fields = req.body;
    const sets   = Object.keys(fields).map(k => `${k}=?`).join(",");
    await db.query(`UPDATE products SET ${sets} WHERE id=?`, [...Object.values(fields), req.params.id]);
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query("DELETE FROM products WHERE id=?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
