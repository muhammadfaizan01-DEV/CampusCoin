import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User, Sparkles, KeyRound, ShieldAlert } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useApp();
  
  const [tab, setTab] = useState('login'); // 'login', 'register', 'forgot'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = login(email, password);
    if (!res.success) setError(res.error);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = register(name, email, password, role);
    if (!res.success) setError(res.error);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setResetSuccess(true);
  };

  const demoLoginStudent = () => {
    login('alex@campus.edu', 'password123');
  };

  const demoLoginAdmin = () => {
    login('admin@campuscoin.com', 'admin123');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="modal-content auth-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Close Button */}
        <button className="modal-close-btn" onClick={() => setIsAuthModalOpen(false)}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="auth-header">
          <div className="auth-icon-badge">
            <Sparkles size={24} />
          </div>
          <h2>{tab === 'login' ? 'Welcome Back' : tab === 'register' ? 'Create Student Account' : 'Reset Password'}</h2>
          <p className="auth-desc">
            {tab === 'login' 
              ? 'Access your personalized budget, AI insights & savings engine.' 
              : tab === 'register' 
              ? 'Join CampusCoin to take control of your student finances.'
              : 'Enter your registered email to receive a password reset token link.'}
          </p>
        </div>

        {/* Error / Success Alert */}
        {error && (
          <div className="auth-alert error">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {resetSuccess && (
          <div className="auth-alert success">
            ✅ Reset token link sent! Check your email inbox.
          </div>
        )}

        {/* Quick Demo Login Preset Buttons */}
        {tab === 'login' && (
          <div className="demo-box">
            <span className="demo-title">⚡ Quick One-Click Demo Access:</span>
            <div className="demo-buttons">
              <button type="button" className="btn btn-primary btn-sm" onClick={demoLoginStudent}>
                Demo Student (Alex)
              </button>
              <button type="button" className="btn btn-purple btn-sm" onClick={demoLoginAdmin}>
                Demo Admin Access
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="field-icon" />
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="alex@campus.edu" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label className="form-label">Password</label>
                <button type="button" className="text-link" onClick={() => setTab('forgot')}>Forgot password?</button>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg full-width">
              Sign In to Account
            </button>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="field-icon" />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Taylor Smith" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="field-icon" />
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="student@university.edu" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Account Role</label>
              <select className="form-input" value={role} onChange={e => setRole(e.target.value)}>
                <option value="student">Student Account</option>
                <option value="admin">Administrator Account</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-lg full-width">
              Create My Account
            </button>
          </form>
        )}

        {tab === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Registered Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="field-icon" />
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="alex@campus.edu" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-purple btn-lg full-width">
              Send Password Reset Link
            </button>
          </form>
        )}

        {/* Auth Switch Footer */}
        <div className="auth-footer">
          {tab === 'login' ? (
            <p>Don't have an account? <button type="button" className="text-link active" onClick={() => setTab('register')}>Register now</button></p>
          ) : (
            <p>Already have an account? <button type="button" className="text-link active" onClick={() => setTab('login')}>Sign In</button></p>
          )}
        </div>
      </div>
    </div>
  );
};
