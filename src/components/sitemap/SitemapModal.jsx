import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, MapPin, LayoutDashboard, Receipt, Target, PieChart, Sparkles, ShieldCheck, User, ExternalLink } from 'lucide-react';

export const SitemapModal = () => {
  const { isSitemapOpen, setIsSitemapOpen, setActiveTab } = useApp();

  if (!isSitemapOpen) return null;

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    setIsSitemapOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsSitemapOpen(false)}>
      <div className="modal-content sitemap-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={() => setIsSitemapOpen(false)}>
          <X size={20} />
        </button>

        <div className="sitemap-header">
          <div className="sitemap-icon-wrapper">
            <MapPin size={24} />
          </div>
          <div>
            <h2>CampusCoin Platform Sitemap</h2>
            <p className="sitemap-desc">Complete architectural hierarchy and feature navigation map</p>
          </div>
        </div>

        <div className="sitemap-tree">
          {/* Root Level */}
          <div className="tree-node root">
            <span className="node-title">🌐 CampusCoin Web App Root</span>
          </div>

          <div className="tree-branches">
            {/* Student Hub */}
            <div className="tree-branch">
              <div className="branch-header" onClick={() => handleNavigate('dashboard')}>
                <LayoutDashboard size={18} />
                <span>1.0 Student Dashboard</span>
                <ExternalLink size={14} className="jump-icon" />
              </div>
              <div className="branch-children">
                <div className="leaf">• Quick Net Balance Header</div>
                <div className="leaf">• Quick-Add Income/Expense Buttons</div>
                <div className="leaf">• Top Spending Category Widget</div>
                <div className="leaf">• Category Budget Consumption Bars</div>
                <div className="leaf">• AI Recommendation Cards</div>
              </div>
            </div>

            {/* Transactions Ledger */}
            <div className="tree-branch">
              <div className="branch-header" onClick={() => handleNavigate('transactions')}>
                <Receipt size={18} />
                <span>2.0 Transactions Ledger</span>
                <ExternalLink size={14} className="jump-icon" />
              </div>
              <div className="branch-children">
                <div className="leaf">• Interactive History Table</div>
                <div className="leaf">• Smart AI Auto-Categorizer Modal</div>
                <div className="leaf">• Multi-Criteria Filter Engine</div>
                <div className="leaf">• CSV Bulk Transaction Import</div>
                <div className="leaf">• Anomaly Alert Detector</div>
              </div>
            </div>

            {/* Budget Goals */}
            <div className="tree-branch">
              <div className="branch-header" onClick={() => handleNavigate('budgets')}>
                <Target size={18} />
                <span>3.0 Budget Goals & Alerts</span>
                <ExternalLink size={14} className="jump-icon" />
              </div>
              <div className="branch-children">
                <div className="leaf">• Category Spend Caps</div>
                <div className="leaf">• Real-time % Progress Indicators</div>
                <div className="leaf">• Budget Forecast Calculator</div>
                <div className="leaf">• Automated Warning Alerts</div>
              </div>
            </div>

            {/* Analytics & Reports */}
            <div className="tree-branch">
              <div className="branch-header" onClick={() => handleNavigate('analytics')}>
                <PieChart size={18} />
                <span>4.0 Monthly Reports & Analytics</span>
                <ExternalLink size={14} className="jump-icon" />
              </div>
              <div className="branch-children">
                <div className="leaf">• Category Donut Breakdown Chart</div>
                <div className="leaf">• 6-Month Income vs Expense Bar Chart</div>
                <div className="leaf">• Daily & Weekly Timeline Summary</div>
                <div className="leaf">• Export Report as Downloadable PDF</div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="tree-branch">
              <div className="branch-header" onClick={() => handleNavigate('insights')}>
                <Sparkles size={18} />
                <span>5.0 AI Insights & Savings Engine</span>
                <ExternalLink size={14} className="jump-icon" />
              </div>
              <div className="branch-children">
                <div className="leaf">• Monthly Narrative Summary</div>
                <div className="leaf">• Spike & Growth Pattern Flagging</div>
                <div className="leaf">• Savings Impact Tip Cards</div>
                <div className="leaf">• Tip Bookmarking & Pinning</div>
              </div>
            </div>

            {/* Admin Panel */}
            <div className="tree-branch">
              <div className="branch-header" onClick={() => handleNavigate('admin')}>
                <ShieldCheck size={18} />
                <span>6.0 Admin Control Panel</span>
                <ExternalLink size={14} className="jump-icon" />
              </div>
              <div className="branch-children">
                <div className="leaf">• System-wide Usage Metrics</div>
                <div className="leaf">• Default Category Manager</div>
                <div className="leaf">• Announcement & Tip Templates</div>
                <div className="leaf">• User Account Reset & Disable</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
