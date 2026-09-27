import React from 'react';
import { AppProvider, useApp } from './context/AppContext';

// Styles
import './index.css';
import './styles/navigation.css';
import './styles/dashboard.css';
import './styles/transactions.css';
import './styles/budgets.css';
import './styles/analytics.css';
import './styles/insights.css';
import './styles/admin.css';
import './styles/modals.css';
import './styles/footer.css';

// Components
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { Dashboard } from './components/dashboard/Dashboard';
import { Transactions } from './components/transactions/Transactions';
import { Budgets } from './components/budgets/Budgets';
import { Analytics } from './components/analytics/Analytics';
import { Insights } from './components/insights/Insights';
import { AdminPanel } from './components/admin/AdminPanel';
import { Profile } from './components/profile/Profile';
import { AuthModal } from './components/auth/AuthModal';
import { SitemapModal } from './components/sitemap/SitemapModal';

const MainLayout = () => {
  const { activeTab } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <Transactions />;
      case 'budgets': return <Budgets />;
      case 'analytics': return <Analytics />;
      case 'insights': return <Insights />;
      case 'admin': return <AdminPanel />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {renderContent()}
      </main>
      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <SitemapModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
