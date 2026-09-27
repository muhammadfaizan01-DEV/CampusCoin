// CampusCoin Hybrid Database API Service (Express Server + Local Storage Sync)

const API_BASE = 'http://localhost:5000/api';

const STORAGE_KEYS = {
  USERS: 'campuscoin_users',
  CURRENT_USER: 'campuscoin_current_user',
  CATEGORIES: 'campuscoin_categories',
  TRANSACTIONS: 'campuscoin_transactions',
  BUDGETS: 'campuscoin_budgets'
};

// Helper for API fetch with fallback to LocalStorage
async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Silent fallback to local storage if backend server is starting up
  }
  return null;
}

export const db = {
  // Auth Operations
  async login(email, password) {
    const apiRes = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (apiRes && apiRes.success) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(apiRes.user));
      return apiRes;
    }

    // Local fallback check
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: 'Invalid email address or password.' };
  },

  async register(name, email, password, role = 'student') {
    const apiRes = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
    if (apiRes && apiRes.success) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(apiRes.user));
      return apiRes;
    }

    // Local fallback
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      password,
      role,
      academic_year: 'Freshman (1st Year)',
      monthly_allowance_baseline: 500,
      savings_goal: 100,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return { success: true, user: newUser };
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
  },

  setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  async getUsers() {
    const apiRes = await fetchAPI('/users');
    if (apiRes) return apiRes;
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  async updateUserProfile(updatedUser) {
    await fetchAPI(`/users/${updatedUser.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedUser)
    });
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    return updatedUser;
  },

  // Categories
  async getCategories() {
    const apiRes = await fetchAPI('/categories');
    if (apiRes) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(apiRes));
      return apiRes;
    }
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
  },

  async addCategory(category) {
    const apiRes = await fetchAPI('/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    });
    if (apiRes) return apiRes;
    
    const cats = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const newCat = { ...category, id: 'cat_' + Date.now(), is_default: false };
    cats.push(newCat);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
    return newCat;
  },

  async deleteCategory(id) {
    await fetchAPI(`/categories/${id}`, { method: 'DELETE' });
    let cats = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    cats = cats.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
  },

  // Transactions
  async getTransactions(userId) {
    const apiRes = await fetchAPI(userId ? `/transactions?userId=${userId}` : '/transactions');
    if (apiRes) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(apiRes));
      return apiRes;
    }
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    return userId ? all.filter(t => t.user_id === userId) : all;
  },

  async addTransaction(tx) {
    const apiRes = await fetchAPI('/transactions', {
      method: 'POST',
      body: JSON.stringify(tx)
    });
    if (apiRes) return apiRes;

    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
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
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    const idx = all.findIndex(t => t.id === tx.id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...tx };
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
    }
  },

  async deleteTransaction(id) {
    await fetchAPI(`/transactions/${id}`, { method: 'DELETE' });
    let all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    all = all.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
  },

  // Budgets
  async getBudgets(userId) {
    const apiRes = await fetchAPI(userId ? `/budgets?userId=${userId}` : '/budgets');
    if (apiRes) {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(apiRes));
      return apiRes;
    }
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS) || '[]');
    return userId ? all.filter(b => b.user_id === userId) : all;
  },

  async setBudget(userId, categoryId, limitAmount) {
    await fetchAPI('/budgets', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, category_id: categoryId, limit_amount: limitAmount })
    });
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS) || '[]');
    const idx = all.findIndex(b => b.user_id === userId && b.category_id === categoryId);
    if (idx !== -1) {
      all[idx].limit_amount = parseFloat(limitAmount);
    } else {
      all.push({ id: 'b_' + Date.now(), user_id: userId, category_id: categoryId, limit_amount: parseFloat(limitAmount) });
    }
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(all));
  }
};
