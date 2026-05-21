import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import toast from "react-hot-toast";
import "./Cart.css";

export default function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address,  setAddress]  = useState("");
  const [ordering, setOrdering] = useState(false);

  const handleOrder = async () => {
    if (!address.trim()) { toast.error("Please enter a delivery address"); return; }
    setOrdering(true);
    try {
      const { data } = await api.post("/orders", { address });
      toast.success(`Order #${data.orderId} placed!`);
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setOrdering(false);
    }
  };

  if (!items.length) {
    return (
      <div className="cart-empty page-enter container">
        <FiShoppingBag size={56} />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page page-enter container">
      <h1>Shopping Cart <span className="cart-count">({items.length} items)</span></h1>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-row">
              <div className="cart-img">
                <img src={item.image_url} alt={item.name} />
              </div>
              <div className="cart-item-info">
                <Link to={`/products/${item.product_id}`} className="cart-item-name">{item.name}</Link>
                <span className="cart-item-price">${Number(item.price).toFixed(2)} each</span>
                <div className="cart-item-actions">
                  <div className="qty-control">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}><FiTrash2 size={16}/></button>
                </div>
              </div>
              <span className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-rows">
            <div><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div><span>Shipping</span><span className="free">Free</span></div>
            <div><span>Tax (est.)</span><span>${(total * 0.08).toFixed(2)}</span></div>
          </div>

          <div className="summary-total">
            <strong>Total</strong>
            <strong>${(total * 1.08).toFixed(2)}</strong>
          </div>

          {user ? (
            <>
              <textarea
                className="address-input"
                placeholder="Delivery address…"
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={3}
              />
              <button
                className="btn btn-primary btn-lg checkout-btn"
                onClick={handleOrder}
                disabled={ordering}
              >
                {ordering ? "Placing Order…" : "Place Order"} <FiArrowRight />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-lg checkout-btn">
              Sign In to Checkout <FiArrowRight />
            </Link>
          )}

          <Link to="/products" className="continue-link">← Continue Shopping</Link>
        </aside>
      </div>
    </div>
  );
}
