import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <span className="logo-lux">LUX</span><span className="logo-store">STORE</span>
          <p>Curated essentials for the discerning buyer. Quality without compromise.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Shop</h4>
            <Link to="/products">All Products</Link>
            <Link to="/products?category=electronics">Electronics</Link>
            <Link to="/products?category=fashion">Fashion</Link>
            <Link to="/products?category=home-living">Home & Living</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/cart">Cart</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>© {new Date().getFullYear()} LuxStore. Built with React & Express.</p>
      </div>
    </footer>
  );
}
