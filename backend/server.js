require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const app = express();

// CORS: wildcard origin cannot be combined with credentials:true in browsers.
// Use explicit origin list or disable credentials for public API.
const corsOptions = {
  origin: true,          // reflect request origin (works with credentials)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle pre-flight for all routes

app.use(express.json());

app.use("/api/auth",     require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/cart",     require("./routes/cart"));
app.use("/api/orders",   require("./routes/orders"));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
