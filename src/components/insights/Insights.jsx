import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Lightbulb, Pin, PinOff, ShieldAlert } from 'lucide-react';

export const Insights = () => {
  const { aiInsights, pinnedTips, togglePinTip } = useApp();

  return (
    <div className="insights-page">
      <div className="page-header glass-card">
        <div className="header-brand-box">
          <div className="ai-icon-badge">
            <Sparkles size={26} />
          </div>
          <div>
            <h2>Smart Financial Insights & Savings Hub</h2>
            <p className="subtitle">Algorithmic pattern analysis of your spending habits with high-impact student saving tips</p>
          </div>
        </div>
      </div>

      {/* Main Narrative Card */}
      <div className="glass-card narrative-card">
        <div className="widget-header">
          <div className="title-box">
            <Sparkles className="icon-purple" size={22} />
            <h3>Current Month Plain-Language Analysis</h3>
          </div>
          <span className="badge badge-purple">Algorithmic Analysis</span>
        </div>

        <div className="narrative-body">
          <p className="narrative-paragraph">{aiInsights.narrative}</p>
        </div>

        {/* Highlight Banner */}
        {aiInsights.highestGrowthCat && (
          <div className="pattern-banner">
            <ShieldAlert size={20} className="icon-amber" />
            <div>
              <strong>Spike Detected:</strong> Spending on <u>{aiInsights.highestGrowthCat.name}</u> increased by {aiInsights.highestGrowthPct}% this month compared to your historical average.
            </div>
          </div>
        )}
      </div>

      {/* Pinned & Recommended Tips Feed */}
      <div className="tips-section">
        <div className="section-title-bar">
          <Lightbulb className="icon-amber" size={22} />
          <h3>Personalized Student Saving Recommendations</h3>
        </div>

        <div className="tips-grid">
          {aiInsights.tips.map(tip => {
            const isPinned = pinnedTips.includes(tip.id);
            return (
              <div key={tip.id} className={`glass-card tip-full-card ${isPinned ? 'pinned' : ''}`}>
                <div className="tip-header-row">
                  <span className="tip-cat-badge">{tip.category}</span>
                  <button className="pin-action-btn" onClick={() => togglePinTip(tip.id)}>
                    {isPinned ? (
                      <>
                        <PinOff size={16} className="active" />
                        <span>Pinned to Dash</span>
                      </>
                    ) : (
                      <>
                        <Pin size={16} />
                        <span>Pin Tip</span>
                      </>
                    )}
                  </button>
                </div>

                <h4>{tip.title}</h4>
                <p className="tip-full-desc">{tip.description}</p>

                <div className="tip-footer-row">
                  <span className="impact-pill">Est. Savings: {tip.impact}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
