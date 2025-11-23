import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function RegisterOrg() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    orgName: '',
    adminName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/employees');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h3>Register Organisation</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: '320px' }}>
        <div>
          <label>Organisation Name</label>
          <input
            name="orgName"
            value={form.orgName}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginTop: '8px' }}>
          <label>Admin Name</label>
          <input
            name="adminName"
            value={form.adminName}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginTop: '8px' }}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginTop: '8px' }}>
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        {error && (
          <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>
        )}
        <button type="submit" style={{ marginTop: '12px' }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: '8px' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
