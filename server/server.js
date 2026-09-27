import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'campuscoin_db.json');

// Initial Realistic Seed Data
const getInitialSeedData = () => {
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth();

  const formatDate = (daysAgo) => {
    const d = new Date(now.getTime() - daysAgo * 86400000);
    return d.toISOString().split('T')[0];
  };

  const users = [
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

  const categories = [
    // Income
    { id: 'inc_1', name: 'Allowance', type: 'income', is_default: true, icon: 'Wallet', color: '#10b981' },
    { id: 'inc_2', name: 'Part-time Job', type: 'income', is_default: true, icon: 'Briefcase', color: '#06b6d4' },
    { id: 'inc_3', name: 'Scholarship', type: 'income', is_default: true, icon: 'GraduationCap', color: '#8b5cf6' },
    { id: 'inc_4', name: 'Gift & Cash', type: 'income', is_default: true, icon: 'Gift', color: '#ec4899' },
    { id: 'inc_5', name: 'Other Income', type: 'income', is_default: true, icon: 'Coins', color: '#f59e0b' },
    
    // Expense
    { id: 'exp_1', name: 'Food & Dining', type: 'expense', is_default: true, icon: 'Utensils', color: '#ef4444' },
    { id: 'exp_2', name: 'Campus Transport', type: 'expense', is_default: true, icon: 'Bus', color: '#06b6d4' },
    { id: 'exp_3', name: 'Dorm & Rent', type: 'expense', is_default: true, icon: 'Home', color: '#3b82f6' },
    { id: 'exp_4', name: 'Academics & Books', type: 'expense', is_default: true, icon: 'BookOpen', color: '#8b5cf6' },
    { id: 'exp_5', name: 'Digital Subscriptions', type: 'expense', is_default: true, icon: 'Tv', color: '#a855f7' },
    { id: 'exp_6', name: 'Social & Outings', type: 'expense', is_default: true, icon: 'Film', color: '#f59e0b' },
    { id: 'exp_7', name: 'Miscellaneous', type: 'expense', is_default: true, icon: 'Package', color: '#64748b' }
  ];

  const transactions = [
    // Income
    { id: 'tx_1', user_id: 'user_alex', category_id: 'inc_1', type: 'income', amount: 550.00, description: 'Monthly Family Allowance', date: formatDate(2), recurring: true },
    { id: 'tx_2', user_id: 'user_alex', category_id: 'inc_2', type: 'income', amount: 240.00, description: 'CS Lab Peer Tutor Stipend', date: formatDate(8), recurring: false },
    { id: 'tx_3', user_id: 'user_alex', category_id: 'inc_4', type: 'income', amount: 60.00, description: 'Grandma Birthday Gift', date: formatDate(15), recurring: false },

    // Expense (Current Month)
    { id: 'tx_4', user_id: 'user_alex', category_id: 'exp_1', type: 'expense', amount: 38.50, description: 'Campus Center Cafe & Grill', date: formatDate(1), recurring: false },
    { id: 'tx_5', user_id: 'user_alex', category_id: 'exp_1', type: 'expense', amount: 92.40, description: 'Weekly Groceries at Trader Joe\'s', date: formatDate(3), recurring: false },
    { id: 'tx_6', user_id: 'user_alex', category_id: 'exp_2', type: 'expense', amount: 35.00, description: 'Monthly Campus Subway Pass', date: formatDate(2), recurring: true },
    { id: 'tx_7', user_id: 'user_alex', category_id: 'exp_3', type: 'expense', amount: 260.00, description: 'Quad Dorm Room Rent Share', date: formatDate(1), recurring: true },
    { id: 'tx_8', user_id: 'user_alex', category_id: 'exp_4', type: 'expense', amount: 74.99, description: 'Algorithms & AI Specialization Textbook', date: formatDate(6), recurring: false },
    { id: 'tx_9', user_id: 'user_alex', category_id: 'exp_5', type: 'expense', amount: 14.99, description: 'Spotify & Hulu Student Duo Bundle', date: formatDate(10), recurring: true },
    { id: 'tx_10', user_id: 'user_alex', category_id: 'exp_6', type: 'expense', amount: 28.00, description: 'Friday IMAX Movie Ticket', date: formatDate(7), recurring: false }
  ];

  // Historical transactions for trend charts
  for (let m = 1; m <= 5; m++) {
    const pastDate = new Date(curYear, curMonth - m, 12).toISOString().split('T')[0];
    const pastDate2 = new Date(curYear, curMonth - m, 2).toISOString().split('T')[0];

    transactions.push({
      id: `tx_h_inc_${m}`,
      user_id: 'user_alex',
      category_id: 'inc_1',
      type: 'income',
      amount: 600 + (m * 20),
      description: 'Monthly Allowance',
      date: pastDate2
    });

    transactions.push({
      id: `tx_h_exp_food_${m}`,
      user_id: 'user_alex',
      category_id: 'exp_1',
      type: 'expense',
      amount: 140 + (m * 12),
      description: 'Campus Dining & Canteen',
      date: pastDate
    });

    transactions.push({
      id: `tx_h_exp_rent_${m}`,
      user_id: 'user_alex',
      category_id: 'exp_3',
      type: 'expense',
      amount: 260,
      description: 'Dorm Housing',
      date: pastDate2
    });
  }

  const budgets = [
    { id: 'b_1', user_id: 'user_alex', category_id: 'exp_1', limit_amount: 200.00 },
    { id: 'b_2', user_id: 'user_alex', category_id: 'exp_2', limit_amount: 50.00 },
    { id: 'b_3', user_id: 'user_alex', category_id: 'exp_3', limit_amount: 260.00 },
    { id: 'b_4', user_id: 'user_alex', category_id: 'exp_4', limit_amount: 120.00 },
    { id: 'b_5', user_id: 'user_alex', category_id: 'exp_5', limit_amount: 25.00 },
    { id: 'b_6', user_id: 'user_alex', category_id: 'exp_6', limit_amount: 60.00 }
  ];

  const announcements = [
    { id: 'ann_1', title: 'Campus Financial Aid Deadline', text: 'Spring semester scholarship applications close October 15th. Apply via Student Portal.', date: formatDate(5) },
    { id: 'ann_2', title: 'Student Budgeting Workshop', text: 'Join the Student Financial Literacy Club this Thursday at 5 PM in Union Room 204.', date: formatDate(12) }
  ];

  return { users, categories, transactions, budgets, announcements };
};

// Ensure database file exists
const readDB = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    const initialData = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// API Endpoints

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'CampusCoin Express REST API DB', timestamp: new Date().toISOString() });
});

// Auth Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const dbData = readDB();
  const user = dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (user) {
    if (user.disabled) {
      return res.status(403).json({ error: 'This account has been disabled by campus administration.' });
    }
    return res.json({ success: true, user });
  }
  return res.status(401).json({ error: 'Invalid email address or password.' });
});

// Auth Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role = 'student' } = req.body;
  const dbData = readDB();

  if (dbData.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'An account with this email address already exists.' });
  }

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

  dbData.users.push(newUser);
  writeDB(dbData);
  res.json({ success: true, user: newUser });
});

// Users
app.get('/api/users', (req, res) => {
  const dbData = readDB();
  res.json(dbData.users);
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const dbData = readDB();
  const idx = dbData.users.findIndex(u => u.id === id);
  if (idx !== -1) {
    dbData.users[idx] = { ...dbData.users[idx], ...req.body };
    writeDB(dbData);
    return res.json(dbData.users[idx]);
  }
  res.status(404).json({ error: 'User not found' });
});

// Categories
app.get('/api/categories', (req, res) => {
  const dbData = readDB();
  res.json(dbData.categories);
});

app.post('/api/categories', (req, res) => {
  const dbData = readDB();
  const newCat = {
    ...req.body,
    id: 'cat_' + Date.now(),
    is_default: req.body.is_default || false
  };
  dbData.categories.push(newCat);
  writeDB(dbData);
  res.json(newCat);
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const dbData = readDB();
  dbData.categories = dbData.categories.filter(c => c.id !== id);
  writeDB(dbData);
  res.json({ success: true });
});

// Transactions
app.get('/api/transactions', (req, res) => {
  const { userId } = req.query;
  const dbData = readDB();
  let txs = dbData.transactions;
  if (userId) txs = txs.filter(t => t.user_id === userId);
  res.json(txs);
});

app.post('/api/transactions', (req, res) => {
  const dbData = readDB();
  const newTx = {
    ...req.body,
    id: 'tx_' + Date.now(),
    created_at: new Date().toISOString()
  };
  dbData.transactions.unshift(newTx);
  writeDB(dbData);
  res.json(newTx);
});

app.put('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const dbData = readDB();
  const idx = dbData.transactions.findIndex(t => t.id === id);
  if (idx !== -1) {
    dbData.transactions[idx] = { ...dbData.transactions[idx], ...req.body };
    writeDB(dbData);
    return res.json(dbData.transactions[idx]);
  }
  res.status(404).json({ error: 'Transaction not found' });
});

app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const dbData = readDB();
  dbData.transactions = dbData.transactions.filter(t => t.id !== id);
  writeDB(dbData);
  res.json({ success: true });
});

// Budgets
app.get('/api/budgets', (req, res) => {
  const { userId } = req.query;
  const dbData = readDB();
  let b = dbData.budgets;
  if (userId) b = b.filter(item => item.user_id === userId);
  res.json(b);
});

app.post('/api/budgets', (req, res) => {
  const { user_id, category_id, limit_amount } = req.body;
  const dbData = readDB();
  const idx = dbData.budgets.findIndex(b => b.user_id === user_id && b.category_id === category_id);
  if (idx !== -1) {
    dbData.budgets[idx].limit_amount = parseFloat(limit_amount);
  } else {
    dbData.budgets.push({
      id: 'b_' + Date.now(),
      user_id,
      category_id,
      limit_amount: parseFloat(limit_amount)
    });
  }
  writeDB(dbData);
  res.json({ success: true });
});

// Start Server
app.listen(PORT, () => {
  console.log(`⚡ CampusCoin Express REST API Database Server running on http://localhost:${PORT}`);
});
