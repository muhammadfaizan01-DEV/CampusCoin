import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/db';
import { generateMonthlyInsights, calculateForecast } from '../services/aiEngine';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme & Font Accessibility States
  const [theme, setTheme] = useState(() => localStorage.getItem('campuscoin_theme') || 'dark');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('campuscoin_fontsize') || 'md');

  // User Auth State
  const [currentUser, setCurrentUser] = useState(() => db.getCurrentUser());

  // App Data States
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [pinnedTips, setPinnedTips] = useState(() => JSON.parse(localStorage.getItem('campuscoin_pinned_tips') || '[]'));
  
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Apply Theme & Font attributes on DOM root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('campuscoin_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.className = `font-${fontSize}`;
    localStorage.setItem('campuscoin_fontsize', fontSize);
  }, [fontSize]);

  // Load Data asynchronously from Database Server
  const refreshData = async () => {
    const loadedCategories = await db.getCategories();
    setCategories(loadedCategories);

    const user = db.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      const userTxs = await db.getTransactions(user.id);
      setTransactions(userTxs);
      
      const userBudgets = await db.getBudgets(user.id);
      setBudgets(userBudgets);

      checkBudgetAlerts(userTxs, userBudgets, loadedCategories);
    } else {
      setTransactions([]);
      setBudgets([]);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Check budget limits and generate in-app alert notifications
  const checkBudgetAlerts = (txs, budgetList, catList) => {
    const alerts = [];
    const now = new Date();

    const curMonthTxs = txs.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && t.type === 'expense';
    });

    budgetList.forEach(b => {
      const cat = catList.find(c => c.id === b.category_id);
      if (!cat) return;

      const spent = curMonthTxs.filter(t => t.category_id === b.category_id)
                              .reduce((sum, t) => sum + Number(t.amount), 0);
      const limit = Number(b.limit_amount);

      if (limit > 0) {
        const pct = (spent / limit) * 100;
        if (pct >= 100) {
          alerts.push({
            id: 'alert_' + b.category_id,
            type: 'danger',
            message: `⚠️ Budget Exceeded! ${cat.name} spending ($${spent.toFixed(2)}) crossed limit ($${limit.toFixed(2)}).`,
            time: 'Just now'
          });
        } else if (pct >= 80) {
          alerts.push({
            id: 'alert_' + b.category_id,
            type: 'warning',
            message: `⚡ Budget Warning: ${cat.name} is at ${Math.round(pct)}% of monthly budget limit.`,
            time: 'Just now'
          });
        }
      }
    });

    setNotifications(alerts);
  };

  // Auth Operations
  const login = async (email, password) => {
    const res = await db.login(email, password);
    if (res && res.success) {
      setCurrentUser(res.user);
      setIsAuthModalOpen(false);
      await refreshData();
      return { success: true, user: res.user };
    }
    return { success: false, error: res?.error || 'Invalid email address or password.' };
  };

  const register = async (name, email, password, role = 'student') => {
    const res = await db.register(name, email, password, role);
    if (res && res.success) {
      setCurrentUser(res.user);
      setIsAuthModalOpen(false);
      await refreshData();
      return { success: true, user: res.user };
    }
    return { success: false, error: res?.error || 'Failed to create account.' };
  };

  const logout = () => {
    db.setCurrentUser(null);
    setCurrentUser(null);
    setActiveTab('dashboard');
    refreshData();
  };

  const updateProfile = async (data) => {
    const updated = await db.updateUserProfile({ ...currentUser, ...data });
    setCurrentUser(updated);
  };

  // CRUD Operations
  const addTransaction = async (tx) => {
    if (!currentUser) return;
    await db.addTransaction({ ...tx, user_id: currentUser.id });
    await refreshData();
  };

  const editTransaction = async (tx) => {
    await db.updateTransaction(tx);
    await refreshData();
  };

  const deleteTransaction = async (id) => {
    await db.deleteTransaction(id);
    await refreshData();
  };

  const addCategory = async (category) => {
    await db.addCategory(category);
    await refreshData();
  };

  const deleteCategory = async (id) => {
    await db.deleteCategory(id);
    await refreshData();
  };

  const setCategoryBudget = async (categoryId, limitAmount) => {
    if (!currentUser) return;
    await db.setBudget(currentUser.id, categoryId, limitAmount);
    await refreshData();
  };

  const togglePinTip = (tipId) => {
    setPinnedTips(prev => {
      const updated = prev.includes(tipId) ? prev.filter(id => id !== tipId) : [...prev, tipId];
      localStorage.setItem('campuscoin_pinned_tips', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // AI Calculated Insights for current context
  const aiInsights = generateMonthlyInsights(transactions, budgets, categories);
  const forecast = calculateForecast(transactions);

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      fontSize,
      setFontSize,
      currentUser,
      login,
      register,
      logout,
      updateProfile,
      transactions,
      categories,
      budgets,
      addTransaction,
      editTransaction,
      deleteTransaction,
      addCategory,
      deleteCategory,
      setCategoryBudget,
      aiInsights,
      forecast,
      pinnedTips,
      togglePinTip,
      activeTab,
      setActiveTab,
      notifications,
      isSitemapOpen,
      setIsSitemapOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
