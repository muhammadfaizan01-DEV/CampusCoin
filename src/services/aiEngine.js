// CampusCoin AI & Smart Intelligence Engine

// NLP Keyword Map for Auto-Categorization
const KEYWORD_RULES = {
  // Expense Rules
  exp_1: ['cafe', 'canteen', 'coffee', 'starbucks', 'mcdonalds', 'pizza', 'burger', 'food', 'lunch', 'dinner', 'snack', 'grocery', 'trader joe', 'subway food', 'restaurant', 'dining'],
  exp_2: ['uber', 'lyft', 'bus', 'train', 'metro', 'transit', 'gas', 'fuel', 'taxi', 'ticket', 'flight', 'bike', 'scooter'],
  exp_3: ['rent', 'dorm', 'hostel', 'utility', 'electricity', 'water bill', 'landlord', 'room'],
  exp_4: ['book', 'textbook', 'tuition', 'course', 'udemy', 'coursera', 'stationery', 'notebook', 'pen', 'exam', 'lab', 'library'],
  exp_5: ['netflix', 'spotify', 'apple', 'icloud', 'hulu', 'disney', 'chatgpt', 'youtube', 'subscription', 'software', 'adobe'],
  exp_6: ['movie', 'cinema', 'game', 'steam', 'playstation', 'concert', 'party', 'bowling', 'club', 'pub', 'event', 'ticketmaster'],
  
  // Income Rules
  inc_1: ['allowance', 'parents', 'mom', 'dad', 'family', 'monthly allowance'],
  inc_2: ['job', 'stipend', 'shift', 'work', 'salary', 'tutoring', 'freelance', 'paycheck', 'wage'],
  inc_3: ['scholarship', 'grant', 'fellowship', 'bursary', 'award'],
  inc_4: ['gift', 'birthday', 'present', 'reward', 'cash gift']
};

/**
 * AI Smart Categorizer: Auto-suggests a category as user types description
 */
export const predictCategory = (description, categories) => {
  if (!description || description.trim().length < 2) return null;

  const descLower = description.toLowerCase();

  for (const [catId, keywords] of Object.entries(KEYWORD_RULES)) {
    if (keywords.some(kw => descLower.includes(kw))) {
      const matched = categories.find(c => c.id === catId);
      if (matched) return matched;
    }
  }

  // Default fallback if no keyword matches
  return null;
};

/**
 * AI Monthly Insights & Narrative Generator
 */
export const generateMonthlyInsights = (transactions, budgets, categories) => {
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth();

  // Current Month Transactions
  const curTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === curYear && d.getMonth() === curMonth;
  });

  // Previous Month Transactions
  const prevTxs = transactions.filter(t => {
    const d = new Date(t.date);
    const prevDate = new Date(curYear, curMonth - 1, 1);
    return d.getFullYear() === prevDate.getFullYear() && d.getMonth() === prevDate.getMonth();
  });

  const getCategoryTotal = (txList, catId) => 
    txList.filter(t => t.category_id === catId && t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0);

  let highestGrowthCat = null;
  let highestGrowthPct = 0;
  let highestGrowthDiff = 0;

  // Compare spending changes
  categories.filter(c => c.type === 'expense').forEach(cat => {
    const curSpend = getCategoryTotal(curTxs, cat.id);
    const prevSpend = getCategoryTotal(prevTxs, cat.id);

    if (prevSpend > 0 && curSpend > prevSpend) {
      const diff = curSpend - prevSpend;
      const pct = Math.round((diff / prevSpend) * 100);
      if (pct > highestGrowthPct) {
        highestGrowthPct = pct;
        highestGrowthCat = cat;
        highestGrowthDiff = diff;
      }
    }
  });

  // Calculate totals
  const totalCurExpense = curTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const totalCurIncome = curTxs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const netSavings = totalCurIncome - totalCurExpense;

  let narrative = "";
  if (highestGrowthCat && highestGrowthPct > 15) {
    narrative = `Noticeable increase detected: Your spending on ${highestGrowthCat.name} rose by ${highestGrowthPct}% (+$${highestGrowthDiff.toFixed(2)}) compared to last month.`;
  } else if (totalCurExpense > 0) {
    narrative = `Steady financial pace! You have logged $${totalCurExpense.toFixed(2)} in total expenses so far this month across ${curTxs.filter(t => t.type === 'expense').length} transactions.`;
  } else {
    narrative = `No expense transactions recorded yet for this month. Start logging to unlock personalized AI insights!`;
  }

  // Generate Personalized Saving Tips
  const tips = [];

  if (highestGrowthCat && highestGrowthCat.id === 'exp_1') {
    tips.push({
      id: 'tip_food',
      title: 'Reduce Canteen & Delivery Spikes',
      description: `Packing homemade meals or snacks just 2 days a week could save you up to $45/month on ${highestGrowthCat.name}.`,
      impact: 'High ($45/mo)',
      category: 'Food'
    });
  }

  if (totalCurExpense > totalCurIncome && totalCurIncome > 0) {
    tips.push({
      id: 'tip_overspend',
      title: 'Net Deficit Alert',
      description: `Your monthly expenses ($${totalCurExpense.toFixed(2)}) currently exceed logged income ($${totalCurIncome.toFixed(2)}). Pause non-essential purchases.`,
      impact: 'Critical',
      category: 'General'
    });
  }

  tips.push({
    id: 'tip_sub',
    title: 'Audit Student Subscriptions',
    description: 'Bundle your Spotify and Apple Music with campus student discounts to cut recurring digital charges by 50%.',
    impact: 'Medium ($12/mo)',
    category: 'Subscriptions'
  });

  tips.push({
    id: 'tip_books',
    title: 'Borrow Open-Stax & Campus Library Books',
    description: 'Check out digital open-access textbook repositories before buying brand-new physical editions.',
    impact: 'High ($70/semester)',
    category: 'Academics'
  });

  return {
    narrative,
    netSavings,
    totalIncome: totalCurIncome,
    totalExpense: totalCurExpense,
    highestGrowthCat,
    highestGrowthPct,
    tips
  };
};

/**
 * Anomaly Detector: Flags unusually large transactions
 */
export const detectAnomaly = (amount, categoryId, transactions) => {
  const catTxs = transactions.filter(t => t.category_id === categoryId && t.type === 'expense');
  if (catTxs.length < 2) return false;

  const avg = catTxs.reduce((sum, t) => sum + Number(t.amount), 0) / catTxs.length;
  return Number(amount) > avg * 2.5;
};

/**
 * Budget Forecasting Engine
 */
export const calculateForecast = (transactions) => {
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const curMonthTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && t.type === 'expense';
  });

  const spentSoFar = curMonthTxs.reduce((s, t) => s + Number(t.amount), 0);
  const dailyVelocity = dayOfMonth > 0 ? spentSoFar / dayOfMonth : 0;
  const projectedMonthTotal = Math.round(dailyVelocity * daysInMonth);

  return {
    spentSoFar,
    dailyVelocity: dailyVelocity.toFixed(2),
    projectedMonthTotal,
    daysRemaining: daysInMonth - dayOfMonth
  };
};
