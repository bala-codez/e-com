import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiStar } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    await addToCart(product.id);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="card-img-wrap">
        {!imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="img-placeholder">
            <FiShoppingBag size={32} />
          </div>
        )}
        {product.stock === 0 && <span className="sold-out-badge">Sold Out</span>}
        <div className="card-overlay">
          <button
            className={`btn btn-primary btn-sm quick-add ${adding ? "adding" : ""}`}
            onClick={handleAdd}
            disabled={product.stock === 0 || adding}
          >
            {adding ? "Added ✓" : "Quick Add"}
          </button>
        </div>
      </Link>

      <div className="card-body">
        <span className="tag">{product.category_name}</span>
        <Link to={`/products/${product.id}`}>
          <h3 className="card-title">{product.name}</h3>
        </Link>
        <div className="card-meta">
          <div className="rating">
            <FiStar size={12} fill="var(--gold)" stroke="var(--gold)" />
            <span>{product.rating}</span>
            <span className="reviews">({product.reviews})</span>
          </div>
          <span className="price">${Number(product.price).toFixed(2)}</span>
        </div>
      </div>
    </article>
  );
}
