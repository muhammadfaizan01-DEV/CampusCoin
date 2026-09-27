import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Coins, 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Sparkles, 
  Target, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Bell, 
  Map, 
  User, 
  LogOut, 
  ChevronDown, 
  Type
} from 'lucide-react';

export const Navbar = () => {
  const { 
    theme, 
    toggleTheme, 
    fontSize, 
    setFontSize, 
    currentUser, 
    logout, 
    activeTab, 
    setActiveTab, 
    notifications, 
    setIsSitemapOpen, 
    setIsAuthModalOpen,
    transactions
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);

  // Calculate quick net balance for current month
  const now = new Date();
  const curMonthTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  
  const incomeTotal = curMonthTxs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const expenseTotal = curMonthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const netBalance = incomeTotal - expenseTotal;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'insights', label: 'Smart Insights', icon: Sparkles }
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: ShieldCheck });
  }

  return (
    <header className="nav-header">
      <div className="nav-container">
        {/* Brand Logo */}
        <div className="nav-brand" onClick={() => setActiveTab('dashboard')}>
          <div className="brand-icon-wrapper">
            <Coins className="brand-icon" size={26} />
          </div>
          <div className="brand-text">
            <span className="brand-title">CampusCoin</span>
            <span className="brand-subtitle">Smart Spending</span>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="nav-links">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls & User Profile */}
        <div className="nav-controls">
          {/* Quick Balance Pill */}
          {currentUser && (
            <div className={`balance-pill ${netBalance >= 0 ? 'positive' : 'negative'}`}>
              <span className="balance-label">Month Net:</span>
              <span className="balance-value">${netBalance.toFixed(2)}</span>
            </div>
          )}

          {/* Interactive Sitemap Trigger */}
          <button 
            className="icon-btn" 
            title="View Sitemap" 
            onClick={() => setIsSitemapOpen(true)}
          >
            <Map size={19} />
          </button>

          {/* Font Size Adjuster Menu */}
          <div className="dropdown-container">
            <button 
              className="icon-btn" 
              title="Font Size Accessibility"
              onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
            >
              <Type size={19} />
            </button>
            {isFontMenuOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">Text Size</div>
                <button className={`dropdown-item ${fontSize === 'sm' ? 'selected' : ''}`} onClick={() => { setFontSize('sm'); setIsFontMenuOpen(false); }}>Small (14px)</button>
                <button className={`dropdown-item ${fontSize === 'md' ? 'selected' : ''}`} onClick={() => { setFontSize('md'); setIsFontMenuOpen(false); }}>Medium (16px)</button>
                <button className={`dropdown-item ${fontSize === 'lg' ? 'selected' : ''}`} onClick={() => { setFontSize('lg'); setIsFontMenuOpen(false); }}>Large (18px)</button>
              </div>
            )}
          </div>

          {/* Dark/Light Theme Toggle */}
          <button 
            className="icon-btn" 
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`} 
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Notifications Drawer Toggle */}
          <div className="dropdown-container">
            <button 
              className="icon-btn notif-btn" 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              title="Notifications"
            >
              <Bell size={19} />
              {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
            </button>
            {isNotifOpen && (
              <div className="dropdown-menu notif-menu">
                <div className="dropdown-header">System Notifications</div>
                {notifications.length === 0 ? (
                  <div className="notif-empty">No budget alerts right now!</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`notif-item ${n.type}`}>
                      <div className="notif-msg">{n.message}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User Account / Auth Menu */}
          {currentUser ? (
            <div className="dropdown-container">
              <button 
                className="user-profile-btn" 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" />
                <span className="user-name">{currentUser.name}</span>
                <ChevronDown size={16} />
              </button>
              {isProfileMenuOpen && (
                <div className="dropdown-menu profile-menu">
                  <div className="user-info-box">
                    <p className="u-name">{currentUser.name}</p>
                    <p className="u-email">{currentUser.email}</p>
                    <span className="u-role-badge">{currentUser.role.toUpperCase()}</span>
                  </div>
                  <div className="menu-divider" />
                  <button className="dropdown-item" onClick={() => { setActiveTab('profile'); setIsProfileMenuOpen(false); }}>
                    <User size={16} /> Edit Profile
                  </button>
                  <button className="dropdown-item danger" onClick={() => { logout(); setIsProfileMenuOpen(false); }}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setIsAuthModalOpen(true)}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
