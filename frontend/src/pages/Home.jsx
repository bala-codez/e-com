import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw } from "react-icons/fi";
import api from "../api";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const FEATURES = [
  { icon: <FiTruck size={24}/>,   title: "Free Shipping",   desc: "On all orders over $75" },
  { icon: <FiShield size={24}/>,  title: "Secure Payments", desc: "256-bit SSL encryption" },
  { icon: <FiRefreshCw size={24}/>, title: "Easy Returns",   desc: "30-day return policy" },
];

const CATEGORIES = [
  { name: "Electronics",  slug: "electronics",  img: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600" },
  { name: "Fashion",      slug: "fashion",       img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600" },
  { name: "Home & Living",slug: "home-living",   img: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600" },
  { name: "Sports",       slug: "sports",        img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/products?limit=8&sort=rating").then(r => setFeatured(r.data?.products ?? [])).catch(() => {});
  }, []);

  return (
    <div className="home page-enter">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600" alt="hero" />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content container">
          <p className="hero-eyebrow">New Season Collection</p>
          <h1 className="hero-headline">
            Curated for the<br />
            <em>discerning</em> few.
          </h1>
          <p className="hero-sub">Discover premium products handpicked for quality, craft, and character.</p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">Shop Collection <FiArrowRight /></Link>
            <Link to="/products?category=electronics" className="btn btn-outline btn-lg" style={{borderColor:"rgba(255,255,255,.5)",color:"#fff"}}>Explore Electronics</Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-bar">
        <div className="container features-inner">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <div>
                <strong>{f.title}</strong>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section container">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <Link to="/products" className="see-all">View All <FiArrowRight size={14}/></Link>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map(c => (
            <Link to={`/products?category=${c.slug}`} key={c.slug} className="cat-card">
              <img src={c.img} alt={c.name} loading="lazy" />
              <div className="cat-overlay">
                <span>{c.name}</span>
                <FiArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section container">
        <div className="section-header">
          <h2>Top Rated Products</h2>
          <Link to="/products" className="see-all">View All <FiArrowRight size={14}/></Link>
        </div>
        {featured.length === 0 ? (
          <div className="spinner" />
        ) : (
          <div className="product-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* BANNER */}
      <section className="banner-section container">
        <div className="banner">
          <div className="banner-content">
            <p className="hero-eyebrow" style={{color:"var(--gold)"}}>Limited Time</p>
            <h2>Get 20% off your first order</h2>
            <p>Create an account today and use code <strong>WELCOME20</strong> at checkout.</p>
            <Link to="/register" className="btn btn-gold btn-lg">Create Account</Link>
          </div>
          <div className="banner-img">
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600" alt="offer" />
          </div>
        </div>
      </section>
    </div>
  );
}
