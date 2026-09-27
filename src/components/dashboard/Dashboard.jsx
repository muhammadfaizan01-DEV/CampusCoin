import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Minus, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Target, 
  Receipt, 
  Pin, 
  PinOff, 
  Zap, 
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';
import { TransactionModal } from '../transactions/TransactionModal';

export const Dashboard = () => {
  const { 
    currentUser, 
    transactions, 
    categories, 
    budgets, 
    aiInsights, 
    forecast, 
    pinnedTips, 
    togglePinTip,
    setActiveTab,
    setIsAuthModalOpen
  } = useApp();

  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalType, setTxModalType] = useState('expense');

  const openQuickAdd = (type) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setTxModalType(type);
    setIsTxModalOpen(true);
  };

  const now = new Date();
  const curMonthTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  const totalIncome = curMonthTxs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = curMonthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const netBalance = totalIncome - totalExpense;

  const catTotals = {};
  curMonthTxs.filter(t => t.type === 'expense').forEach(t => {
    catTotals[t.category_id] = (catTotals[t.category_id] || 0) + Number(t.amount);
  });

  let topCatId = null;
  let topCatAmount = 0;
  Object.entries(catTotals).forEach(([cid, amt]) => {
    if (amt > topCatAmount) {
      topCatAmount = amt;
      topCatId = cid;
    }
  });

  const topCategory = categories.find(c => c.id === topCatId);
  const recentTxs = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="dashboard-page">
      {/* Dynamic Header Greeting */}
      <div className="dashboard-welcome glass-card">
        <div className="welcome-info">
          <div className="greeting-badge">
            <Sparkles size={16} />
            <span>Harvard/MIT Student Financial Network</span>
          </div>
          <h1>
            Welcome back, <span className="highlight-text">{currentUser ? currentUser.name : 'Student Guest'}</span> 👋
          </h1>
          <p className="subtitle">
            {currentUser ? `${currentUser.academic_year} • Monthly Savings Target: $${currentUser.savings_goal}` : 'Sign in to access your personal dashboard & smart savings engine.'}
          </p>
        </div>

        <div className="welcome-actions">
          <button className="btn btn-primary" onClick={() => openQuickAdd('income')}>
            <Plus size={18} /> Log Income
          </button>
          <button className="btn btn-purple" onClick={() => openQuickAdd('expense')}>
            <Minus size={18} /> Quick Expense
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="metrics-grid">
        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">Current Month Income</span>
            <div className="metric-icon income">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="metric-value">${totalIncome.toFixed(2)}</div>
          <div className="metric-footer text-success">
            <span>Logged from {curMonthTxs.filter(t => t.type === 'income').length} sources</span>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">Current Month Expense</span>
            <div className="metric-icon expense">
              <TrendingDown size={20} />
            </div>
          </div>
          <div className="metric-value">${totalExpense.toFixed(2)}</div>
          <div className="metric-footer text-muted">
            <span>Forecasted Month End: ${forecast.projectedMonthTotal}</span>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">Net Student Surplus</span>
            <div className={`metric-icon ${netBalance >= 0 ? 'income' : 'expense'}`}>
              <Zap size={20} />
            </div>
          </div>
          <div className={`metric-value ${netBalance >= 0 ? 'text-success' : 'text-danger'}`}>
            ${netBalance.toFixed(2)}
          </div>
          <div className="metric-footer">
            <span>{netBalance >= 0 ? 'Positive Savings Surplus 🎉' : 'Operating in Net Deficit ⚠️'}</span>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">Top Spending Category</span>
            <div className="metric-icon purple">
              <Target size={20} />
            </div>
          </div>
          <div className="metric-value">
            {topCategory ? topCategory.name : 'N/A'}
          </div>
          <div className="metric-footer text-muted">
            <span>{topCategory ? `$${topCatAmount.toFixed(2)} spent so far` : 'No expenses recorded yet'}</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Two-Column Layout */}
      <div className="dashboard-grid">
        {/* Left Main Column: Smart Insights + Budget Progress */}
        <div className="dash-col main-col">
          {/* Smart Monthly Insights Box */}
          <div className="glass-card ai-insight-widget">
            <div className="widget-header">
              <div className="title-box">
                <Sparkles className="icon-purple" size={22} />
                <h3>Smart Financial Summary</h3>
              </div>
              <span className="badge badge-purple">Financial Advisory</span>
            </div>
            <p className="narrative-text">{aiInsights.narrative}</p>
            <div className="insight-stat-row">
              <div className="stat-item">
                <span className="lbl">Highest Growth</span>
                <span className="val">{aiInsights.highestGrowthCat ? `${aiInsights.highestGrowthCat.name} (+${aiInsights.highestGrowthPct}%)` : 'Stable'}</span>
              </div>
              <div className="stat-item">
                <span className="lbl">Velocity/Day</span>
                <span className="val">${forecast.dailyVelocity}/day</span>
              </div>
              <div className="stat-item">
                <span className="lbl">Days Remaining</span>
                <span className="val">{forecast.daysRemaining} days</span>
              </div>
            </div>
          </div>

          {/* Budget vs Actual Progress Widget */}
          <div className="glass-card budget-widget">
            <div className="widget-header">
              <div className="title-box">
                <Target className="icon-green" size={22} />
                <h3>Category Budget Progress</h3>
              </div>
              <button className="text-link" onClick={() => setActiveTab('budgets')}>
                Manage Goals <ArrowRight size={16} />
              </button>
            </div>

            <div className="budget-progress-list">
              {budgets.slice(0, 4).map(b => {
                const cat = categories.find(c => c.id === b.category_id);
                if (!cat) return null;
                const spent = curMonthTxs.filter(t => t.category_id === b.category_id && t.type === 'expense')
                                        .reduce((s, t) => s + Number(t.amount), 0);
                const pct = Math.min(Math.round((spent / b.limit_amount) * 100), 100);
                const isOver = spent > b.limit_amount;
                const isWarning = pct >= 80 && !isOver;

                return (
                  <div key={b.id} className="budget-item">
                    <div className="b-label-row">
                      <div className="b-cat-info">
                        <CategoryIcon iconName={cat.icon} categoryId={cat.id} size={16} />
                        <span className="b-name">{cat.name}</span>
                      </div>
                      <span className="b-amt">${spent.toFixed(2)} / ${b.limit_amount.toFixed(2)}</span>
                    </div>
                    <div className="b-bar-bg">
                      <div 
                        className={`b-bar-fill ${isOver ? 'danger' : isWarning ? 'warning' : 'success'}`} 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Saving Tips Engine + Recent Transactions */}
        <div className="dash-col side-col">
          {/* Recommended Saving Tips Engine Widget */}
          <div className="glass-card tips-widget">
            <div className="widget-header">
              <div className="title-box">
                <Lightbulb className="icon-amber" size={22} />
                <h3>Personalized Savings Engine</h3>
              </div>
            </div>

            <div className="tips-list">
              {aiInsights.tips.slice(0, 3).map(tip => {
                const isPinned = pinnedTips.includes(tip.id);
                return (
                  <div key={tip.id} className={`tip-card ${isPinned ? 'pinned' : ''}`}>
                    <div className="tip-card-header">
                      <span className="tip-title">{tip.title}</span>
                      <button className="pin-btn" onClick={() => togglePinTip(tip.id)}>
                        {isPinned ? <PinOff size={16} className="active" /> : <Pin size={16} />}
                      </button>
                    </div>
                    <p className="tip-desc">{tip.description}</p>
                    <div className="tip-impact-badge">
                      Impact: {tip.impact}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Log Widget */}
          <div className="glass-card recent-widget">
            <div className="widget-header">
              <div className="title-box">
                <Receipt className="icon-blue" size={22} />
                <h3>Recent Activity</h3>
              </div>
              <button className="text-link" onClick={() => setActiveTab('transactions')}>
                View All <ArrowRight size={16} />
              </button>
            </div>

            <div className="recent-list">
              {recentTxs.map(t => {
                const cat = categories.find(c => c.id === t.category_id);
                const isIncome = t.type === 'income';
                return (
                  <div key={t.id} className="recent-item">
                    <CategoryIcon iconName={cat ? cat.icon : 'Package'} categoryId={t.category_id} size={18} />
                    <div className="tx-info">
                      <p className="tx-desc">{t.description}</p>
                      <span className="tx-meta">{cat ? cat.name : 'Category'} • {t.date}</span>
                    </div>
                    <div className={`tx-amount ${isIncome ? 'text-success' : 'text-main'}`}>
                      {isIncome ? '+' : '-'}${Number(t.amount).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Transaction Modal */}
      {isTxModalOpen && (
        <TransactionModal 
          isOpen={isTxModalOpen} 
          onClose={() => setIsTxModalOpen(false)} 
          initialType={txModalType} 
        />
      )}
    </div>
  );
};
