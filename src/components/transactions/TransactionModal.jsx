import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { predictCategory, detectAnomaly } from '../../services/aiEngine';
import { X, Sparkles, AlertTriangle, Check, RefreshCw } from 'lucide-react';

export const TransactionModal = ({ isOpen, onClose, initialType = 'expense', editTx = null }) => {
  const { categories, addTransaction, editTransaction, transactions } = useApp();

  const [type, setType] = useState(initialType);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [recurring, setRecurring] = useState(false);
  const [aiSuggestedCat, setAiSuggestedCat] = useState(null);
  const [isAnomaly, setIsAnomaly] = useState(false);

  useEffect(() => {
    if (editTx) {
      setType(editTx.type);
      setDescription(editTx.description);
      setAmount(editTx.amount);
      setCategoryId(editTx.category_id);
      setDate(editTx.date);
      setRecurring(editTx.recurring || false);
    } else {
      setType(initialType);
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setRecurring(false);
      
      const firstCat = categories.find(c => c.type === initialType);
      if (firstCat) setCategoryId(firstCat.id);
    }
  }, [editTx, initialType, categories]);

  const handleDescriptionChange = (e) => {
    const val = e.target.value;
    setDescription(val);

    if (!editTx) {
      const suggested = predictCategory(val, categories);
      if (suggested) {
        setAiSuggestedCat(suggested);
        setCategoryId(suggested.id);
        setType(suggested.type);
      } else {
        setAiSuggestedCat(null);
      }
    }
  };

  const handleAmountChange = (e) => {
    const amt = e.target.value;
    setAmount(amt);
    if (amt && categoryId && type === 'expense') {
      const anomaly = detectAnomaly(amt, categoryId, transactions);
      setIsAnomaly(anomaly);
    } else {
      setIsAnomaly(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !categoryId) return;

    const txData = {
      type,
      description,
      amount: parseFloat(amount),
      category_id: categoryId,
      date,
      recurring,
      ai_suggested_category: aiSuggestedCat ? aiSuggestedCat.id : null
    };

    if (editTx) {
      editTransaction({ ...editTx, ...txData });
    } else {
      addTransaction(txData);
    }

    onClose();
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content tx-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="tx-modal-header">
          <h2>{editTx ? 'Edit Transaction' : 'Log New Transaction'}</h2>
          <p className="tx-modal-subtitle">Fast student income & expense entry with auto-categorization</p>
        </div>

        {/* Transaction Type Switcher */}
        <div className="type-toggle-bar">
          <button 
            type="button" 
            className={`type-btn income ${type === 'income' ? 'active' : ''}`}
            onClick={() => {
              setType('income');
              const firstInc = categories.find(c => c.type === 'income');
              if (firstInc) setCategoryId(firstInc.id);
            }}
          >
            + Income Entry
          </button>
          <button 
            type="button" 
            className={`type-btn expense ${type === 'expense' ? 'active' : ''}`}
            onClick={() => {
              setType('expense');
              const firstExp = categories.find(c => c.type === 'expense');
              if (firstExp) setCategoryId(firstExp.id);
            }}
          >
            - Expense Entry
          </button>
        </div>

        {/* Auto Categorization Alert Banner */}
        {aiSuggestedCat && (
          <div className="ai-suggest-banner">
            <Sparkles size={16} className="icon-purple" />
            <span>Smart Suggested Category: <strong>{aiSuggestedCat.name}</strong></span>
          </div>
        )}

        {/* Anomaly Detector Alert Banner */}
        {isAnomaly && (
          <div className="anomaly-banner">
            <AlertTriangle size={16} />
            <span>Unusually Large Expense! This is 2.5x higher than your average for this category.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="tx-form">
          <div className="form-group">
            <label className="form-label">Transaction Description</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Campus Cafe, Library Tutoring, Rent share..." 
              value={description}
              onChange={handleDescriptionChange}
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Amount ($ USD)</label>
              <input 
                type="number" 
                step="0.01" 
                min="0.01" 
                className="form-input" 
                placeholder="45.00" 
                value={amount}
                onChange={handleAmountChange}
                required 
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Category</label>
              <select 
                className="form-input" 
                value={categoryId} 
                onChange={e => setCategoryId(e.target.value)}
                required
              >
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={date}
                onChange={e => setDate(e.target.value)}
                required 
              />
            </div>

            <div className="form-group flex-1 checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={recurring} 
                  onChange={e => setRecurring(e.target.checked)} 
                />
                <span className="chk-text">
                  <RefreshCw size={14} /> Recurring Monthly Entry
                </span>
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Check size={18} /> {editTx ? 'Save Changes' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
