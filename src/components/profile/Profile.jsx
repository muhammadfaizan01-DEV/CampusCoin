import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, GraduationCap, DollarSign, Target, Save, Check } from 'lucide-react';

export const Profile = () => {
  const { currentUser, updateProfile } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [academicYear, setAcademicYear] = useState(currentUser?.academic_year || 'Freshman (1st Year)');
  const [allowance, setAllowance] = useState(currentUser?.monthly_allowance_baseline || 500);
  const [savingsGoal, setSavingsGoal] = useState(currentUser?.savings_goal || 100);
  const [saved, setSaved] = useState(false);

  if (!currentUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      academic_year: academicYear,
      monthly_allowance_baseline: parseFloat(allowance),
      savings_goal: parseFloat(savingsGoal)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="profile-page">
      <div className="page-header glass-card">
        <h2>Student Profile & Settings</h2>
        <p className="subtitle">Manage your personal allowance baselines, academic year, and savings target</p>
      </div>

      <div className="glass-card profile-card">
        <div className="user-profile-header">
          <img src={currentUser.avatar} alt={currentUser.name} className="profile-avatar-lg" />
          <div>
            <h3>{currentUser.name}</h3>
            <p className="u-email">{currentUser.email}</p>
            <span className="badge badge-purple">{currentUser.role.toUpperCase()}</span>
          </div>
        </div>

        {saved && (
          <div className="auth-alert success">
            <Check size={16} /> Profile settings updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label className="form-label">Full Student Name</label>
            <div className="input-with-icon">
              <User size={18} className="field-icon" />
              <input 
                type="text" 
                className="form-input" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Academic Standing / Year</label>
            <div className="input-with-icon">
              <GraduationCap size={18} className="field-icon" />
              <select 
                className="form-input" 
                value={academicYear} 
                onChange={e => setAcademicYear(e.target.value)}
              >
                <option value="Freshman (1st Year)">Freshman (1st Year)</option>
                <option value="Sophomore (2nd Year)">Sophomore (2nd Year)</option>
                <option value="Junior (3rd Year)">Junior (3rd Year)</option>
                <option value="Senior (4th Year)">Senior (4th Year)</option>
                <option value="Graduate Student">Graduate Student</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Monthly Allowance Baseline ($)</label>
              <div className="input-with-icon">
                <DollarSign size={18} className="field-icon" />
                <input 
                  type="number" 
                  className="form-input" 
                  value={allowance} 
                  onChange={e => setAllowance(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Monthly Savings Target ($)</label>
              <div className="input-with-icon">
                <Target size={18} className="field-icon" />
                <input 
                  type="number" 
                  className="form-input" 
                  value={savingsGoal} 
                  onChange={e => setSavingsGoal(e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={18} /> Update Profile Settings
          </button>
        </form>
      </div>
    </div>
  );
};
