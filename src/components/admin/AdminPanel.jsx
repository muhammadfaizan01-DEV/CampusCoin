import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../services/db';
import { 
  ShieldCheck, 
  Users, 
  Receipt, 
  Tag, 
  Megaphone, 
  RotateCcw, 
  UserX, 
  UserCheck, 
  Plus, 
  Trash2,
  Lock,
  BarChart2
} from 'lucide-react';

export const AdminPanel = () => {
  const { currentUser, categories, addCategory, deleteCategory, refreshData } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState('users'); // 'users', 'categories', 'announcements', 'stats'
  const [userList, setUserList] = useState(() => db.getUsers());
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Welcome Fall Semester 2026!', text: 'CampusCoin is live across dorms. Set your budget goals now.', date: '2026-09-01' },
    { id: 2, title: 'Campus Financial Literacy Workshop', text: 'Free workshop at Student Union Hall on Thursday 5 PM.', date: '2026-09-15' }
  ]);

  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnText, setNewAnnText] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('expense');

  // Protection Check: Admin role required
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="admin-denied glass-card">
        <ShieldCheck size={48} className="icon-rose" />
        <h2>Access Restricted</h2>
        <p>Administrator privileges are required to view the Admin Control Panel.</p>
        <p className="hint">Use demo admin account: <code>admin@campuscoin.com</code> / <code>admin123</code></p>
      </div>
    );
  }

  // Account Toggle
  const toggleUserStatus = (userId) => {
    const updated = userList.map(u => {
      if (u.id === userId) {
        return { ...u, disabled: !u.disabled };
      }
      return u;
    });
    localStorage.setItem('campuscoin_users', JSON.stringify(updated));
    setUserList(updated);
  };

  // Password Reset Simulation
  const handleResetPassword = (userId) => {
    const updated = userList.map(u => {
      if (u.id === userId) {
        return { ...u, password: 'resetPassword123' };
      }
      return u;
    });
    localStorage.setItem('campuscoin_users', JSON.stringify(updated));
    setUserList(updated);
    alert(`Password reset to 'resetPassword123' for student ID: ${userId}`);
  };

  // Announcement Handler
  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnText) return;
    setAnnouncements(prev => [
      { id: Date.now(), title: newAnnTitle, text: newAnnText, date: new Date().toISOString().split('T')[0] },
      ...prev
    ]);
    setNewAnnTitle('');
    setNewAnnText('');
  };

  // Default Category Handler
  const handleAddDefaultCat = (e) => {
    e.preventDefault();
    if (!newCatName) return;
    addCategory({ name: newCatName, type: newCatType, is_default: true });
    setNewCatName('');
  };

  // Platform Stats Computation
  const allTxs = db.getTransactions();
  const totalVolume = allTxs.reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="admin-page">
      <div className="page-header glass-card">
        <div className="admin-header-box">
          <div className="admin-badge-icon">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h2>Administrator Control Panel</h2>
            <p className="subtitle">Campus-wide platform metrics, default categories, announcement broadcasts & user management</p>
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="admin-nav-bar glass-card">
        <button 
          className={`admin-nav-btn ${activeAdminTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('users')}
        >
          <Users size={18} /> User Accounts ({userList.length})
        </button>
        <button 
          className={`admin-nav-btn ${activeAdminTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('categories')}
        >
          <Tag size={18} /> Default Categories
        </button>
        <button 
          className={`admin-nav-btn ${activeAdminTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('announcements')}
        >
          <Megaphone size={18} /> Announcements
        </button>
        <button 
          className={`admin-nav-btn ${activeAdminTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('stats')}
        >
          <BarChart2 size={18} /> Usage Statistics
        </button>
      </div>

      {/* Tab Content: User Accounts */}
      {activeAdminTab === 'users' && (
        <div className="glass-card table-container">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Student / User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Academic Year</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.map(u => (
                <tr key={u.id}>
                  <td className="user-cell">
                    <img src={u.avatar} alt={u.name} className="user-avatar-sm" />
                    <span className="u-name-text">{u.name}</span>
                  </td>
                  <td>{u.email}</td>
                  <td><span className="badge badge-purple">{u.role}</span></td>
                  <td>{u.academic_year || 'N/A'}</td>
                  <td>
                    <span className={`badge ${u.disabled ? 'badge-danger' : 'badge-success'}`}>
                      {u.disabled ? 'Disabled' : 'Active'}
                    </span>
                  </td>
                  <td className="text-right actions-cell">
                    <button 
                      className="btn btn-outline btn-sm" 
                      onClick={() => handleResetPassword(u.id)}
                      title="Reset Password"
                    >
                      <RotateCcw size={14} /> Reset Pass
                    </button>
                    {u.role !== 'admin' && (
                      <button 
                        className={`btn btn-sm ${u.disabled ? 'btn-primary' : 'btn-danger'}`} 
                        onClick={() => toggleUserStatus(u.id)}
                      >
                        {u.disabled ? <UserCheck size={14} /> : <UserX size={14} />}
                        {u.disabled ? 'Enable' : 'Disable'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content: Default Categories */}
      {activeAdminTab === 'categories' && (
        <div className="glass-card">
          <h3>Manage System Default Categories</h3>
          <p className="subtitle">These categories are available to all students campus-wide</p>

          <form onSubmit={handleAddDefaultCat} className="admin-form">
            <div className="form-row">
              <input 
                type="text" 
                className="form-input flex-2" 
                placeholder="New Default Category Name (e.g. Campus Printing)..." 
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                required 
              />
              <select className="form-input flex-1" value={newCatType} onChange={e => setNewCatType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <button type="submit" className="btn btn-primary">
                <Plus size={16} /> Add System Category
              </button>
            </div>
          </form>

          <div className="cat-badge-list" style={{ marginTop: 20 }}>
            {categories.map(c => (
              <div key={c.id} className="cat-item-pill">
                <span>{c.name} ({c.type})</span>
                <button className="del-cat-btn" onClick={() => deleteCategory(c.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Announcements */}
      {activeAdminTab === 'announcements' && (
        <div className="glass-card">
          <h3>Broadcast Campus Financial Announcements</h3>
          
          <form onSubmit={handleAddAnnouncement} className="admin-form">
            <div className="form-group">
              <label className="form-label">Announcement Title</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Free Financial Workshop this Thursday" 
                value={newAnnTitle}
                onChange={e => setNewAnnTitle(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message Text</label>
              <textarea 
                className="form-input" 
                rows="3" 
                placeholder="Broadcast details for students..." 
                value={newAnnText}
                onChange={e => setNewAnnText(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-purple">
              <Megaphone size={16} /> Publish Announcement
            </button>
          </form>

          <div className="announcement-list">
            {announcements.map(ann => (
              <div key={ann.id} className="ann-card">
                <div className="ann-header">
                  <h4>{ann.title}</h4>
                  <span className="ann-date">{ann.date}</span>
                </div>
                <p>{ann.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Usage Statistics */}
      {activeAdminTab === 'stats' && (
        <div className="metrics-grid">
          <div className="glass-card metric-card">
            <span className="metric-title">Active Platform Students</span>
            <div className="metric-value">{userList.filter(u => u.role === 'student').length}</div>
            <div className="metric-footer text-success">Registered across campus</div>
          </div>
          <div className="glass-card metric-card">
            <span className="metric-title">Total Transactions Tracked</span>
            <div className="metric-value">{allTxs.length}</div>
            <div className="metric-footer text-muted">Across all active accounts</div>
          </div>
          <div className="glass-card metric-card">
            <span className="metric-title">Total Financial Volume</span>
            <div className="metric-value">${totalVolume.toFixed(2)}</div>
            <div className="metric-footer text-success">Logged student transactions</div>
          </div>
        </div>
      )}
    </div>
  );
};
