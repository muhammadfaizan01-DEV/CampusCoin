// CampusCoin Ultra-Reliable Hybrid Database API Service

const API_BASE = 'http://localhost:5000/api';

const STORAGE_KEYS = {
  USERS: 'campuscoin_users',
  CURRENT_USER: 'campuscoin_current_user',
  CATEGORIES: 'campuscoin_categories',
  TRANSACTIONS: 'campuscoin_transactions',
  BUDGETS: 'campuscoin_budgets'
};

const DEFAULT_CATEGORIES = [
  { id: 'inc_1', name: 'Allowance', type: 'income', is_default: true, icon: 'Wallet', color: '#10b981' },
  { id: 'inc_2', name: 'Part-time Job', type: 'income', is_default: true, icon: 'Briefcase', color: '#06b6d4' },
  { id: 'inc_3', name: 'Scholarship', type: 'income', is_default: true, icon: 'GraduationCap', color: '#8b5cf6' },
  { id: 'inc_4', name: 'Gift & Cash', type: 'income', is_default: true, icon: 'Gift', color: '#ec4899' },
  { id: 'inc_5', name: 'Other Income', type: 'income', is_default: true, icon: 'Coins', color: '#f59e0b' },
  { id: 'exp_1', name: 'Food & Dining', type: 'expense', is_default: true, icon: 'Utensils', color: '#ef4444' },
  { id: 'exp_2', name: 'Campus Transport', type: 'expense', is_default: true, icon: 'Bus', color: '#06b6d4' },
  { id: 'exp_3', name: 'Dorm & Rent', type: 'expense', is_default: true, icon: 'Home', color: '#3b82f6' },
  { id: 'exp_4', name: 'Academics & Books', type: 'expense', is_default: true, icon: 'BookOpen', color: '#8b5cf6' },
  { id: 'exp_5', name: 'Digital Subscriptions', type: 'expense', is_default: true, icon: 'Tv', color: '#a855f7' },
  { id: 'exp_6', name: 'Social & Outings', type: 'expense', is_default: true, icon: 'Film', color: '#f59e0b' },
  { id: 'exp_7', name: 'Miscellaneous', type: 'expense', is_default: true, icon: 'Package', color: '#64748b' }
];

const DEFAULT_USERS = [
  {
    id: 'user_alex',
    name: 'Alex Rivera',
    email: 'alex@campus.edu',
    password: 'password123',
    role: 'student',
    academic_year: 'Junior (Computer Science B.S. \'27)',
    monthly_allowance_baseline: 680.00,
    savings_goal: 180.00,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    created_at: new Date(Date.now() - 180 * 86400000).toISOString()
  },
  {
    id: 'user_admin',
    name: 'Campus Financial Admin',
    email: 'admin@campuscoin.com',
    password: 'admin123',
    role: 'admin',
    academic_year: 'Student Affairs Office',
    monthly_allowance_baseline: 0,
    savings_goal: 0,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    created_at: new Date(Date.now() - 365 * 86400000).toISOString()
  }
];

const generateSeedTransactions = () => {
  const transactions = [];
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth();

  const formatDate = (daysAgo) => {
    const d = new Date(now.getTime() - daysAgo * 86400000);
    return d.toISOString().split('T')[0];
  };

  transactions.push(
    { id: 'tx_1', user_id: 'user_alex', category_id: 'inc_1', type: 'income', amount: 550.00, description: 'Monthly Family Allowance', date: formatDate(2), recurring: true },
    { id: 'tx_2', user_id: 'user_alex', category_id: 'inc_2', type: 'income', amount: 240.00, description: 'CS Lab Peer Tutor Stipend', date: formatDate(8), recurring: false },
    { id: 'tx_3', user_id: 'user_alex', category_id: 'inc_4', type: 'income', amount: 60.00, description: 'Grandma Birthday Gift', date: formatDate(15), recurring: false },
    { id: 'tx_4', user_id: 'user_alex', category_id: 'exp_1', type: 'expense', amount: 38.50, description: 'Campus Center Cafe & Grill', date: formatDate(1), recurring: false },
    { id: 'tx_5', user_id: 'user_alex', category_id: 'exp_1', type: 'expense', amount: 92.40, description: 'Weekly Groceries at Trader Joe\'s', date: formatDate(3), recurring: false },
    { id: 'tx_6', user_id: 'user_alex', category_id: 'exp_2', type: 'expense', amount: 35.00, description: 'Monthly Campus Subway Pass', date: formatDate(2), recurring: true },
    { id: 'tx_7', user_id: 'user_alex', category_id: 'exp_3', type: 'expense', amount: 260.00, description: 'Quad Dorm Room Rent Share', date: formatDate(1), recurring: true },
    { id: 'tx_8', user_id: 'user_alex', category_id: 'exp_4', type: 'expense', amount: 74.99, description: 'Algorithms Specialization Textbook', date: formatDate(6), recurring: false },
    { id: 'tx_9', user_id: 'user_alex', category_id: 'exp_5', type: 'expense', amount: 14.99, description: 'Spotify & Hulu Student Duo Bundle', date: formatDate(10), recurring: true },
    { id: 'tx_10', user_id: 'user_alex', category_id: 'exp_6', type: 'expense', amount: 28.00, description: 'Friday IMAX Movie Ticket', date: formatDate(7), recurring: false }
  );

  for (let m = 1; m <= 5; m++) {
    const pastDate = new Date(curYear, curMonth - m, 12).toISOString().split('T')[0];
    const pastDate2 = new Date(curYear, curMonth - m, 2).toISOString().split('T')[0];

    transactions.push({ id: `tx_h_inc_${m}`, user_id: 'user_alex', category_id: 'inc_1', type: 'income', amount: 600 + (m * 20), description: 'Monthly Allowance', date: pastDate2 });
    transactions.push({ id: `tx_h_exp_food_${m}`, user_id: 'user_alex', category_id: 'exp_1', type: 'expense', amount: 140 + (m * 12), description: 'Campus Dining & Canteen', date: pastDate });
    transactions.push({ id: `tx_h_exp_rent_${m}`, user_id: 'user_alex', category_id: 'exp_3', type: 'expense', amount: 260, description: 'Dorm Housing', date: pastDate2 });
  }

  return transactions;
};

const DEFAULT_BUDGETS = [
  { id: 'b_1', user_id: 'user_alex', category_id: 'exp_1', limit_amount: 200.00 },
  { id: 'b_2', user_id: 'user_alex', category_id: 'exp_2', limit_amount: 50.00 },
  { id: 'b_3', user_id: 'user_alex', category_id: 'exp_3', limit_amount: 260.00 },
  { id: 'b_4', user_id: 'user_alex', category_id: 'exp_4', limit_amount: 120.00 },
  { id: 'b_5', user_id: 'user_alex', category_id: 'exp_5', limit_amount: 25.00 },
  { id: 'b_6', user_id: 'user_alex', category_id: 'exp_6', limit_amount: 60.00 }
];

export const initLocalData = () => {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(generateSeedTransactions()));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BUDGETS)) {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(DEFAULT_BUDGETS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    }
  } catch (e) {
    console.error("Local storage init error", e);
  }
};

initLocalData();

async function fetchAPI(endpoint, options = {}) {
  // Only attempt backend server API fetch if on local environment
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return null;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: controller.signal,
      ...options
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback to local storage if API server is not running
  }
  return null;
}

export const db = {
  async login(email, password) {
    initLocalData();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // 1. Try Backend API Server
    const apiRes = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: cleanEmail, password: cleanPass })
    });
    if (apiRes && apiRes.success) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(apiRes.user));
      return apiRes;
    }

    // 2. Guaranteed Local Fallback Check
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || JSON.stringify(DEFAULT_USERS));
    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: 'Invalid email address or password. Please check your credentials.' };
  },

  async register(name, email, password, role = 'student') {
    initLocalData();
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // 1. Try Backend API Server
    const apiRes = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: cleanName, email: cleanEmail, password: cleanPass, role })
    });
    if (apiRes && apiRes.success) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(apiRes.user));
      return apiRes;
    }

    // 2. Guaranteed Local Fallback Register
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || JSON.stringify(DEFAULT_USERS));
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      role,
      academic_year: 'Freshman (1st Year)',
      monthly_allowance_baseline: 500,
      savings_goal: 100,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return { success: true, user: newUser };
  },

  getCurrentUser() {
    initLocalData();
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return DEFAULT_USERS[0];
    try {
      return JSON.parse(raw);
    } catch (e) {
      return DEFAULT_USERS[0];
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  async getUsers() {
    const apiRes = await fetchAPI('/users');
    if (apiRes) return apiRes;
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || JSON.stringify(DEFAULT_USERS));
  },

  async updateUserProfile(updatedUser) {
    await fetchAPI(`/users/${updatedUser.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedUser)
    });
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    return updatedUser;
  },

  async getCategories() {
    const apiRes = await fetchAPI('/categories');
    if (apiRes) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(apiRes));
      return apiRes;
    }
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || JSON.stringify(DEFAULT_CATEGORIES));
  },

  async addCategory(category) {
    const apiRes = await fetchAPI('/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    });
    if (apiRes) return apiRes;
    
    const cats = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || JSON.stringify(DEFAULT_CATEGORIES));
    const newCat = { ...category, id: 'cat_' + Date.now(), is_default: false };
    cats.push(newCat);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
    return newCat;
  },

  async deleteCategory(id) {
    await fetchAPI(`/categories/${id}`, { method: 'DELETE' });
    let cats = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || JSON.stringify(DEFAULT_CATEGORIES));
    cats = cats.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
  },

  async getTransactions(userId) {
    const apiRes = await fetchAPI(userId ? `/transactions?userId=${userId}` : '/transactions');
    if (apiRes) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(apiRes));
      return apiRes;
    }
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || JSON.stringify(generateSeedTransactions()));
    return userId ? all.filter(t => t.user_id === userId) : all;
  },

  async addTransaction(tx) {
    const apiRes = await fetchAPI('/transactions', {
      method: 'POST',
      body: JSON.stringify(tx)
    });
    if (apiRes) return apiRes;

    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || JSON.stringify(generateSeedTransactions()));
    const newTx = { ...tx, id: 'tx_' + Date.now(), created_at: new Date().toISOString() };
    all.unshift(newTx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
    return newTx;
  },

  async updateTransaction(tx) {
    await fetchAPI(`/transactions/${tx.id}`, {
      method: 'PUT',
      body: JSON.stringify(tx)
    });
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || JSON.stringify(generateSeedTransactions()));
    const idx = all.findIndex(t => t.id === tx.id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...tx };
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
    }
  },

  async deleteTransaction(id) {
    await fetchAPI(`/transactions/${id}`, { method: 'DELETE' });
    let all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || JSON.stringify(generateSeedTransactions()));
    all = all.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
  },

  async getBudgets(userId) {
    const apiRes = await fetchAPI(userId ? `/budgets?userId=${userId}` : '/budgets');
    if (apiRes) {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(apiRes));
      return apiRes;
    }
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS) || JSON.stringify(DEFAULT_BUDGETS));
    return userId ? all.filter(b => b.user_id === userId) : all;
  },

  async setBudget(userId, categoryId, limitAmount) {
    await fetchAPI('/budgets', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, category_id: categoryId, limit_amount: limitAmount })
    });
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS) || JSON.stringify(DEFAULT_BUDGETS));
    const idx = all.findIndex(b => b.user_id === userId && b.category_id === categoryId);
    if (idx !== -1) {
      all[idx].limit_amount = parseFloat(limitAmount);
    } else {
      all.push({ id: 'b_' + Date.now(), user_id: userId, category_id: categoryId, limit_amount: parseFloat(limitAmount) });
    }
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(all));
  }
};
