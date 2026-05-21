import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err,  setErr]  = useState("");
  const [busy, setBusy] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (ex) {
      setErr(ex.response?.data?.message || "Login failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="logo-lux">LUX</span><span className="logo-store">STORE</span>
        </div>
        <h2>Welcome back</h2>
        <p className="auth-sub">Sign in to your account</p>

        {err && <div className="auth-error">{err}</div>}

        <form onSubmit={handle} className="auth-form">
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
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({...f, password: e.target.value}))}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg submit-btn" disabled={busy}>
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
}
