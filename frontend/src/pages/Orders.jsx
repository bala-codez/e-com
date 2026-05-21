import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage } from "react-icons/fi";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import "./Orders.css";

const STATUS_COLOR = {
  pending:    "status-pending",
  processing: "status-processing",
  shipped:    "status-shipped",
  delivered:  "status-delivered",
  cancelled:  "status-cancelled",
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get("/orders/my")
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <div className="orders-empty page-enter container">
      <p>Please <Link to="/login">sign in</Link> to view your orders.</p>
    </div>
  );

  return (
    <div className="orders-page page-enter container">
      <h1>My Orders</h1>
      {loading ? <div className="spinner" /> : orders.length === 0 ? (
        <div className="orders-empty">
          <FiPackage size={48} />
          <p>No orders yet.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(o => (
            <div key={o.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{o.id}</h3>
                  <p className="order-date">{new Date(o.created_at).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</p>
                </div>
                <div className="order-right">
                  <span className={`status-badge ${STATUS_COLOR[o.status]}`}>{o.status}</span>
                  <span className="order-total">${Number(o.total).toFixed(2)}</span>
                </div>
              </div>
              <div className="order-items">
                {o.items?.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="order-item-img">
                      <img src={item.image_url} alt={item.name} />
                    </div>
                    <div className="order-item-info">
                      <Link to={`/products/${item.product_id}`}>{item.name}</Link>
                      <span>Qty: {item.quantity} · ${Number(item.price).toFixed(2)} each</span>
                    </div>
                    <span className="order-item-sub">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {o.address && <p className="order-address">📍 {o.address}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
