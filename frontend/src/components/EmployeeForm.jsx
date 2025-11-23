import React, { useState, useEffect } from 'react';

export default function EmployeeForm({ onSubmit, initialData = null, onCancel }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  // keep create vs edit in sync
  useEffect(() => {
    if (initialData && typeof initialData === 'object') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
      });
    } else {
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-16">
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="first_name">First name</label>
          <input
            id="first_name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="Madhav"
            autoComplete="given-name"
          />
        </div>
        <div className="form-field">
          <label htmlFor="last_name">Last name</label>
          <input
            id="last_name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Gouni"
            autoComplete="family-name"
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
          />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 81064 09444"
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save employee
        </button>
      </div>
    </form>
  );
}
