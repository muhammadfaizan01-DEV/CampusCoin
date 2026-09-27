import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, AlertTriangle, CheckCircle2, TrendingUp, Edit2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Budgets = () => {
  const { categories, budgets, setCategoryBudget, transactions, forecast } = useApp();

  const [editingCatId, setEditingCatId] = useState(null);
  const [newLimit, setNewLimit] = useState('');

  const now = new Date();
  const curMonthTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && t.type === 'expense';
  });

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleSaveBudget = (catId) => {
    if (!newLimit || isNaN(newLimit)) return;
    setCategoryBudget(catId, newLimit);
    setEditingCatId(null);
    setNewLimit('');

    // Trigger celebratory confetti effect on budget goal set!
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const startEdit = (catId, currentLimit) => {
    setEditingCatId(catId);
    setNewLimit(currentLimit);
  };

  return (
    <div className="budgets-page">
      <div className="page-header glass-card">
        <div>
          <h2>Monthly Category Budgets & Goal Tracking</h2>
          <p className="subtitle">Set spending caps per category to keep your student expenses on track</p>
        </div>

        <div className="forecast-pill">
          <Zap size={18} className="icon-purple" />
          <span>Projected Month End Spending: <strong>${forecast.projectedMonthTotal}</strong></span>
        </div>
      </div>

      <div className="budgets-grid">
        {expenseCategories.map(cat => {
          const budgetObj = budgets.find(b => b.category_id === cat.id);
          const limit = budgetObj ? Number(budgetObj.limit_amount) : 0;
          const spent = curMonthTxs.filter(t => t.category_id === cat.id).reduce((s, t) => s + Number(t.amount), 0);
          const pct = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
          const isOver = limit > 0 && spent > limit;
          const isWarning = limit > 0 && pct >= 80 && !isOver;

          return (
            <div key={cat.id} className={`glass-card budget-card ${isOver ? 'over-limit' : ''}`}>
              <div className="budget-card-header">
                <div className="cat-title-box">
                  <Target size={20} className={isOver ? 'text-danger' : 'icon-green'} />
                  <h3>{cat.name}</h3>
                </div>

                <button 
                  className="icon-btn sm" 
                  title="Edit Budget Cap"
                  onClick={() => startEdit(cat.id, limit)}
                >
                  <Edit2 size={15} />
                </button>
              </div>

              {/* Edit Limit Inline Form */}
              {editingCatId === cat.id ? (
                <div className="edit-limit-box">
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="Enter monthly limit ($)" 
                    value={newLimit}
                    onChange={e => setNewLimit(e.target.value)}
                    autoFocus
                  />
                  <div className="edit-btns">
                    <button className="btn btn-primary btn-sm" onClick={() => handleSaveBudget(cat.id)}>
                      Save Cap
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => setEditingCatId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="budget-numbers">
                    <div className="b-num">
                      <span className="lbl">Spent So Far</span>
                      <span className={`val ${isOver ? 'text-danger' : 'text-main'}`}>${spent.toFixed(2)}</span>
                    </div>
                    <div className="b-num text-right">
                      <span className="lbl">Monthly Limit Cap</span>
                      <span className="val">${limit.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Dynamic Consumption Progress Bar */}
                  <div className="progress-container">
                    <div className="progress-bar-bg">
                      <div 
                        className={`progress-bar-fill ${isOver ? 'danger' : isWarning ? 'warning' : 'success'}`} 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                    <div className="progress-meta">
                      <span>{pct}% Consumed</span>
                      <span>{limit > spent ? `$${(limit - spent).toFixed(2)} remaining` : `Exceeded by $${(spent - limit).toFixed(2)}`}</span>
                    </div>
                  </div>

                  {/* Status Indicator Pill */}
                  <div className="status-footer">
                    {isOver ? (
                      <span className="badge badge-danger">
                        <AlertTriangle size={12} /> Budget Exceeded!
                      </span>
                    ) : isWarning ? (
                      <span className="badge badge-warning">
                        ⚡ Nearing Monthly Limit Cap
                      </span>
                    ) : (
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} /> Within Healthy Range
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
