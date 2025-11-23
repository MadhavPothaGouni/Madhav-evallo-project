import React from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import Login from './pages/Login';
import Employees from './pages/Employees';
import Teams from './pages/Teams';

function AppLayout({ children }) {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="logo-block">
            <span className="logo-dot" />
            <div>
              <div className="logo-title">HRMS</div>
              <div className="logo-subtitle">Human Resource Management</div>
            </div>
          </div>

          <nav className="nav-links">
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' nav-link-active' : '')
              }
            >
              Employees
            </NavLink>

            <NavLink
              to="/teams"
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' nav-link-active' : '')
              }
            >
              Teams
            </NavLink>
          </nav>

          <div className="nav-right">
            <button
              className="btn btn-ghost"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="app-main-inner">{children}</div>
      </main>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teams"
        element={
          <ProtectedRoute>
            <Teams />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
