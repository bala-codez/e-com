import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate   = useNavigate();
  const { pathname } = useLocation();
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query,      setQuery]      = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner container">
          <button className="nav-icon mobile-menu-btn" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          <Link to="/" className="logo">
            <span className="logo-lux">LUX</span>
            <span className="logo-store">STORE</span>
          </Link>

          <div className="nav-links">
            <Link to="/products" className={pathname.startsWith("/products") ? "active" : ""}>Shop</Link>
            <Link to="/products?category=electronics">Electronics</Link>
            <Link to="/products?category=fashion">Fashion</Link>
            <Link to="/products?category=home-living">Home</Link>
          </div>

          <div className="nav-actions">
            <button className="nav-icon" onClick={() => setSearchOpen(o => !o)} aria-label="Search">
              <FiSearch size={18} />
            </button>

            {user ? (
              <div className="user-menu">
                <button className="nav-icon user-btn" aria-label="Account">
                  <FiUser size={18} />
                  <span className="user-name">{user.name.split(" ")[0]}</span>
                </button>
                <div className="dropdown">
                  <Link to="/orders">My Orders</Link>
                  {user.role === "admin" && <Link to="/admin">Admin Panel</Link>}
                  <button onClick={logout}>Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="nav-icon" aria-label="Login">
                <FiUser size={18} />
              </Link>
            )}

            <Link to="/cart" className="nav-icon cart-btn" aria-label="Cart">
              <FiShoppingBag size={18} />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div className="search-bar">
            <form onSubmit={handleSearch} className="container">
              <FiSearch size={16} />
              <input
                autoFocus
                placeholder="Search products…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
            </form>
          </div>
        )}
      </nav>

      <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <Link to="/products">All Products</Link>
        <Link to="/products?category=electronics">Electronics</Link>
        <Link to="/products?category=fashion">Fashion</Link>
        <Link to="/products?category=home-living">Home & Living</Link>
        <Link to="/products?category=sports">Sports</Link>
        {user ? (
          <>
            <Link to="/orders">My Orders</Link>
            {user.role === "admin" && <Link to="/admin">Admin Panel</Link>}
            <button onClick={logout}>Sign Out</button>
          </>
        ) : (
          <Link to="/login">Sign In</Link>
        )}
      </div>
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
}
