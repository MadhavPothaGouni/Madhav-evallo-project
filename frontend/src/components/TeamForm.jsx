import React, { useState, useEffect } from 'react';

export default function TeamForm({ onSubmit, initialData = null, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (initialData && typeof initialData === 'object') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
      });
    } else {
      setForm({
        name: '',
        description: '',
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
        <div className="form-field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="name">Team name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Garuda Engineers"
          />
        </div>
        <div className="form-field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short description for this team…"
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save team
        </button>
      </div>
    </form>
  );
}
