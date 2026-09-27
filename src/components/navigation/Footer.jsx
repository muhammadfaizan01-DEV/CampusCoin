import React from 'react';
import { useApp } from '../../context/AppContext';
import { Coins, MapPin, Heart, Shield } from 'lucide-react';

export const Footer = () => {
  const { setIsSitemapOpen, setActiveTab } = useApp();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="brand-icon-wrapper sm">
            <Coins size={20} />
          </div>
          <div>
            <span className="footer-title">CampusCoin</span>
            <p className="footer-tagline">Smart Spending Student Style • End-to-End Web Solutions</p>
          </div>
        </div>

        <div className="footer-links">
          <button className="footer-link" onClick={() => setActiveTab('dashboard')}>Dashboard</button>
          <button className="footer-link" onClick={() => setActiveTab('transactions')}>Transactions</button>
          <button className="footer-link" onClick={() => setActiveTab('budgets')}>Budgets</button>
          <button className="footer-link" onClick={() => setActiveTab('analytics')}>Analytics</button>
          <button className="footer-link" onClick={() => setActiveTab('insights')}>AI Insights</button>
          <button className="footer-link highlighted" onClick={() => setIsSitemapOpen(true)}>
            <MapPin size={14} /> View Sitemap
          </button>
        </div>

        <div className="footer-copy">
          <span>Built for TechWiz Competition • Software Requirements Specification v1.0</span>
        </div>
      </div>
    </footer>
  );
};
