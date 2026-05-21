import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiUsers, FiDollarSign, FiShoppingBag } from "react-icons/fi";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Admin.css";

const STATUS_OPTIONS = ["pending","processing","shipped","delivered","cancelled"];

export default function Admin() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats,  setStats]  = useState({ orders:0, revenue:0 });
  const [tab,    setTab]    = useState("orders");

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/"); return; }
    api.get("/orders/all").then(r => {
      setOrders(r.data);
      setStats({
        orders:  r.data.length,
        revenue: r.data.reduce((s, o) => s + Number(o.total), 0),
      });
    }).catch(() => {});
  }, [user, navigate]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders(o => o.map(x => x.id === id ? {...x, status} : x));
      toast.success("Status updated");
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="admin-page page-enter container">
      <h1>Admin Panel</h1>

      <div className="admin-stats">
        {[
          { icon: <FiShoppingBag size={24}/>, label: "Total Orders",   value: stats.orders },
          { icon: <FiDollarSign size={24}/>,  label: "Total Revenue",  value: `$${stats.revenue.toFixed(2)}` },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <span className="stat-icon">{s.icon}</span>
            <div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-table-wrap">
        <h2>All Orders</h2>
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.user_name}</td>
                  <td>{o.email}</td>
                  <td><strong>${Number(o.total).toFixed(2)}</strong></td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={e => updateStatus(o.id, e.target.value)}
                      className={`status-select status-${o.status}`}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
