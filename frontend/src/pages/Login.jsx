// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    orgName: '',
    adminName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        const res = await api.post('/auth/login', {
          email: form.email,
          password: form.password
        });
        localStorage.setItem('token', res.data.token);
        navigate('/employees');
      } else {
        const res = await api.post('/auth/register', {
          orgName: form.orgName,
          adminName: form.adminName,
          email: form.email,
          password: form.password
        });
        localStorage.setItem('token', res.data.token);
        navigate('/employees');
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        (mode === 'login' ? 'Login failed' : 'Registration failed')
      );
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        <h1 className="auth-title">
          {mode === "login" ? "Welcome back 👋" : "Create organisation"}
        </h1>

        <p className="auth-subtitle">
          {mode === "login"
            ? "Sign in to manage employees and teams."
            : "Set up your organisation and admin account."}
        </p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "register" && (
            <>
              <div className="form-field">
                <label>Organisation name</label>
                <input
                  name="orgName"
                  value={form.orgName}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                />
              </div>

              <div className="form-field">
                <label>Admin name</label>
                <input
                  name="adminName"
                  value={form.adminName}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
            </>
          )}

          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@company.com"
            />
          </div>

          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <button className="btn-primary" type="submit">
            {mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? (
            <>
              No organisation yet?{" "}
              <button onClick={() => setMode("register")}>Register</button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")}>Login</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
