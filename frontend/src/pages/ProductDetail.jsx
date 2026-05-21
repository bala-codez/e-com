import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiStar, FiShoppingBag, FiArrowLeft, FiCheck } from "react-icons/fi";
import api from "../api";
import { useCart } from "../context/CartContext";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty,     setQty]     = useState(1);
  const [adding,  setAdding]  = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data)).catch(() => {});
  }, [id]);

  const handleAdd = async () => {
    setAdding(true);
    await addToCart(product.id, qty);
    setTimeout(() => setAdding(false), 800);
  };

  if (!product) return <div className="spinner" style={{ marginTop: 140 }} />;

  const stars = Math.round(product.rating);

  return (
    <div className="detail-page page-enter container">
      <Link to="/products" className="back-link">
        <FiArrowLeft size={16} /> Back to Products
      </Link>

      <div className="detail-grid">
        {/* Image */}
        <div className="detail-img-wrap">
          {!imgError ? (
            <img
              src={product.image_url}
              alt={product.name}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="img-placeholder large"><FiShoppingBag size={48} /></div>
          )}
        </div>

        {/* Info */}
        <div className="detail-info">
          <span className="tag">{product.category_name}</span>
          <h1 className="detail-title">{product.name}</h1>

          <div className="detail-rating">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} size={16}
                fill={i < stars ? "var(--gold)" : "none"}
                stroke={i < stars ? "var(--gold)" : "var(--ink-40)"}
              />
            ))}
            <span>{product.rating} · {product.reviews} reviews</span>
          </div>

          <p className="detail-price">${Number(product.price).toFixed(2)}</p>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-stock">
            {product.stock > 0 ? (
              <span className="in-stock"><FiCheck size={14} /> In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-stock">Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="add-row">
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <button
                className={`btn btn-primary btn-lg add-btn ${adding ? "adding" : ""}`}
                onClick={handleAdd}
                disabled={adding}
              >
                <FiShoppingBag size={18} />
                {adding ? "Added to Cart ✓" : "Add to Cart"}
              </button>
            </div>
          )}

          <div className="detail-meta">
            <div><strong>Category</strong><span>{product.category_name}</span></div>
            <div><strong>SKU</strong><span>SKU-{String(product.id).padStart(5,"0")}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
