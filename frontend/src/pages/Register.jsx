import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err,  setErr]  = useState("");
  const [busy, setBusy] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setErr("Password must be at least 6 characters"); return; }
    setBusy(true); setErr("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (ex) {
      setErr(ex.response?.data?.message || "Registration failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="logo-lux">LUX</span><span className="logo-store">STORE</span>
        </div>
        <h2>Create account</h2>
        <p className="auth-sub">Join LuxStore today</p>

        {err && <div className="auth-error">{err}</div>}

        <form onSubmit={handle} className="auth-form">
          <div className="field">
            <label>Full Name</label>
            <input
              placeholder="John Doe"
              value={form.name}
              onChange={e => setForm(f => ({...f, name: e.target.value}))}
              required
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({...f, email: e.target.value}))}
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={e => setForm(f => ({...f, password: e.target.value}))}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg submit-btn" disabled={busy}>
            {busy ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
