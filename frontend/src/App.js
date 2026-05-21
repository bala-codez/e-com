import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar   from "./components/Navbar";
import Footer   from "./components/Footer";
import Home          from "./pages/Home";
import Products      from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart          from "./pages/Cart";
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import Orders        from "./pages/Orders";
import Admin         from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid #e8e4dd",
                boxShadow: "0 8px 32px rgba(0,0,0,.12)",
              },
            }}
          />
          <Navbar />
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/products"    element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart"        element={<Cart />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/orders"      element={<Orders />} />
            <Route path="/admin"       element={<Admin />} />
          </Routes>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
