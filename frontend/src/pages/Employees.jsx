import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import EmployeeForm from '../components/EmployeeForm';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const loadEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to load employees', err);
      setError('Failed to load employees');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEmployees();
  }, []);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, data);
      } else {
        await api.post('/employees', data);
      }

      setShowForm(false);
      setEditingEmployee(null);
      await loadEmployees();
    } catch (err) {
      console.error('Failed to save employee', err);
      setError('Failed to save employee');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      await loadEmployees();
    } catch (err) {
      console.error('Failed to delete employee', err);
      setError('Failed to delete employee');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      {/* Top nav */}
      <header className="top-nav">
        <div className="nav-left">
          <div className="nav-logo">H</div>
          <div className="nav-heading">
            <div className="nav-title">HRMS</div>
            <div className="nav-subtitle">Human Resource Management</div>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/employees">
            <button
              className={
                'nav-pill' + (location.pathname.startsWith('/employees') ? ' active' : '')
              }
            >
              Employees
            </button>
          </Link>
          <Link to="/teams">
            <button
              className={'nav-pill' + (location.pathname.startsWith('/teams') ? ' active' : '')}
            >
              Teams
            </button>
          </Link>
          <button className="nav-pill" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

    
      <main className="page">
        <section className="card">
          <div className="section-header">
            <div className="section-heading">
              <h2>Employees</h2>
              <p className="section-subtitle">
                Add, edit and remove employees for your organisation.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingEmployee(null);
                setShowForm(true);
              }}
            >
              + Add employee
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}

          {showForm && (
            <EmployeeForm
              initialData={editingEmployee}
              onSubmit={handleCreateOrUpdate}
              onCancel={() => {
                setEditingEmployee(null);
                setShowForm(false);
              }}
            />
          )}

          {!showForm && (
            <ul className="stack-list" style={{ marginTop: employees.length ? 12 : 0 }}>
              {employees.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>
                  No employees yet. Use <strong>Add employee</strong> to create one.
                </p>
              )}

              {employees.map((emp) => (
                <li key={emp.id} className="stack-item">
                  <div className="item-main">
                    <p className="item-title">
                      {emp.first_name} {emp.last_name}
                    </p>
                    <p className="item-meta">
                      {emp.email} · {emp.phone || 'No phone'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-ghost"
                      onClick={() => {
                        setEditingEmployee(emp);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        if (window.confirm('Delete this employee?')) {
                          handleDelete(emp.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
