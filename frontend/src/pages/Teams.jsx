import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import TeamForm from '../components/TeamForm';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [assignInput, setAssignInput] = useState({}); 
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const loadTeams = async () => {
    try {
      const res = await api.get('/teams');
      setTeams(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to load teams', err);
      setError('Failed to load teams');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTeams();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editingTeam) {
        await api.put(`/teams/${editingTeam.id}`, data);
      } else {
        await api.post('/teams', data);
      }

      setShowForm(false);
      setEditingTeam(null);
      await loadTeams();
    } catch (err) {
      console.error('Failed to save team', err);
      setError('Failed to save team');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/teams/${id}`);
      await loadTeams();
    } catch (err) {
      console.error('Failed to delete team', err);
      setError('Failed to delete team');
    }
  };

  const handleAssign = async (teamId) => {
    try {
      const employeeId = assignInput[teamId];
      if (!employeeId) return;

      await api.post(`/teams/${teamId}/assign`, { employeeId: Number(employeeId) });
      setAssignInput((prev) => ({ ...prev, [teamId]: '' }));
      await loadTeams();
    } catch (err) {
      console.error('Failed to assign employee', err);
      setError('Failed to assign employee');
    }
  };

  const handleUnassign = async (teamId, employeeId) => {
    try {
      await api.post(`/teams/${teamId}/unassign`, { employeeId });
      await loadTeams();
    } catch (err) {
      console.error('Failed to unassign employee', err);
      setError('Failed to unassign employee');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="top-nav">
        <div className="nav-left">
          <div className="nav-logo">H</div>
          <div className="nav-heading">
            <div className="nav-title">HRMS</div>
            <div className="nav-subtitle">Teams & assignments</div>
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
              <h2>Teams</h2>
              <p className="section-subtitle">
                Group employees into teams and manage assignments.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingTeam(null);
                setShowForm(true);
              }}
            >
              + Add team
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}

          {showForm && (
            <TeamForm
              initialData={editingTeam}
              onSubmit={handleSave}
              onCancel={() => {
                setEditingTeam(null);
                setShowForm(false);
              }}
            />
          )}

          {!showForm && (
            <ul className="stack-list" style={{ marginTop: teams.length ? 12 : 0 }}>
              {teams.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>
                  No teams yet. Create a team and then assign employees.
                </p>
              )}

              {teams.map((team) => (
                <li key={team.id} className="stack-item">
                  <div className="item-main">
                    <p className="item-title">{team.name}</p>
                    <p className="item-meta">{team.description || 'No description'}</p>

                    <div className="item-badge-row">
                      <span className="chip">
                        {team.Employees && team.Employees.length > 0
                          ? `${team.Employees.length} member${
                              team.Employees.length > 1 ? 's' : ''
                            }`
                          : 'No members yet'}
                      </span>
                    </div>

                    {team.Employees && team.Employees.length > 0 && (
                      <div style={{ marginTop: 6, fontSize: 13 }}>
                        <span style={{ color: 'var(--muted)' }}>Members:&nbsp;</span>
                        {team.Employees.map((emp, idx) => (
                          <span key={emp.id} style={{ marginRight: 6 }}>
                            {emp.first_name}{' '}
                            <button
                              type="button"
                              className="link-button"
                              onClick={() => handleUnassign(team.id, emp.id)}
                            >
                              Unassign
                            </button>
                            {idx < team.Employees.length - 1 && ','}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-ghost"
                        onClick={() => {
                          setEditingTeam(team);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          if (window.confirm('Delete this team?')) {
                            handleDelete(team.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                      <input
                        type="number"
                        placeholder="Employee ID"
                        value={assignInput[team.id] || ''}
                        onChange={(e) =>
                          setAssignInput((prev) => ({
                            ...prev,
                            [team.id]: e.target.value,
                          }))
                        }
                        style={{
                          flex: 1,
                          borderRadius: 999,
                          border: '1px solid rgba(51,65,85,0.9)',
                          background: 'rgba(15,23,42,0.96)',
                          padding: '7px 10px',
                          fontSize: 13,
                          color: 'var(--text)',
                        }}
                      />
                      <button className="btn btn-primary" onClick={() => handleAssign(team.id)}>
                        Assign
                      </button>
                    </div>
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
