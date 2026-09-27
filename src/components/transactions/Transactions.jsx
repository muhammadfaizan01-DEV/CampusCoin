import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Edit3, 
  Trash2, 
  Sparkles, 
  FolderPlus,
  RefreshCw
} from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';
import { TransactionModal } from './TransactionModal';
import { CategoryModal } from './CategoryModal';

export const Transactions = () => {
  const { transactions, categories, deleteTransaction, addTransaction } = useApp();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  // Filter logic
  const filteredTxs = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || t.type === selectedType;
    const matchesCat = selectedCat === 'all' || t.category_id === selectedCat;
    return matchesSearch && matchesType && matchesCat;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  // CSV Export Handler
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Date,Type,Category,Description,Amount ($),Recurring\n";
    filteredTxs.forEach(t => {
      const cat = categories.find(c => c.id === t.category_id);
      const catName = cat ? cat.name : 'Unknown';
      csvContent += `${t.id},${t.date},${t.type},"${catName}","${t.description}",${t.amount},${t.recurring ? 'Yes' : 'No'}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `campuscoin_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Bulk Import Handler
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split('\n');
      let count = 0;
      
      lines.slice(1).forEach(line => {
        if (!line.trim()) return;
        const parts = line.split(',');
        if (parts.length >= 5) {
          const date = parts[1]?.trim() || new Date().toISOString().split('T')[0];
          const type = parts[2]?.trim().toLowerCase() === 'income' ? 'income' : 'expense';
          const catName = parts[3]?.replace(/"/g, '').trim();
          const desc = parts[4]?.replace(/"/g, '').trim() || 'Imported Entry';
          const amt = parseFloat(parts[5]) || 10.0;

          let cat = categories.find(c => c.name.toLowerCase() === catName?.toLowerCase());
          if (!cat) cat = categories.find(c => c.type === type);

          addTransaction({
            type,
            description: desc,
            amount: amt,
            category_id: cat ? cat.id : 'exp_7',
            date,
            recurring: false
          });
          count++;
        }
      });
      alert(`Successfully imported ${count} historical transactions!`);
    };
    reader.readAsText(file);
  };

  const handleEdit = (tx) => {
    setEditingTx(tx);
    setIsTxModalOpen(true);
  };

  return (
    <div className="transactions-page">
      {/* Header Bar */}
      <div className="page-header glass-card">
        <div>
          <h2>Income & Expense Ledger</h2>
          <p className="subtitle">Track, filter, and manage all your student financial records</p>
        </div>

        <div className="header-actions">
          <label className="btn btn-outline btn-sm import-label">
            <Upload size={16} /> Import CSV
            <input type="file" accept=".csv" onChange={handleImportCSV} style={{ display: 'none' }} />
          </label>
          <button className="btn btn-outline btn-sm" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-purple btn-sm" onClick={() => setIsCatModalOpen(true)}>
            <FolderPlus size={16} /> Categories
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => { setEditingTx(null); setIsTxModalOpen(true); }}>
            <Plus size={16} /> Log Entry
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar glass-card">
        <div className="search-input-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search transactions by keyword..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-item">
            <Filter size={16} />
            <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
              <option value="all">All Types (Income & Expense)</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>

          <div className="filter-item">
            <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="table-container glass-card">
        <table className="tx-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Amount ($)</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTxs.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table">
                  No matching transaction records found. Try clearing your filters or log a new entry!
                </td>
              </tr>
            ) : (
              filteredTxs.map(t => {
                const cat = categories.find(c => c.id === t.category_id);
                const isIncome = t.type === 'income';
                return (
                  <tr key={t.id} className="tx-row">
                    <td>
                      <div className="cell-cat-box">
                        <CategoryIcon iconName={cat ? cat.icon : 'Package'} categoryId={t.category_id} size={18} />
                        <span className="tx-cat">{cat ? cat.name : 'Category'}</span>
                      </div>
                    </td>
                    <td className="tx-date">{t.date}</td>
                    <td>
                      <span className={`badge ${isIncome ? 'badge-success' : 'badge-danger'}`}>
                        {isIncome ? 'Income' : 'Expense'}
                      </span>
                      {t.recurring && (
                        <span className="badge badge-purple" title="Recurring Entry" style={{ marginLeft: 6 }}>
                          <RefreshCw size={10} />
                        </span>
                      )}
                    </td>
                    <td className="tx-desc-cell">
                      {t.description}
                      {t.ai_suggested_category && (
                        <Sparkles size={13} className="icon-purple inline-sparkle" title="AI Categorized" />
                      )}
                    </td>
                    <td className={`tx-amount-cell ${isIncome ? 'text-success' : 'text-main'}`}>
                      {isIncome ? '+' : '-'}${Number(t.amount).toFixed(2)}
                    </td>
                    <td className="text-right actions-cell">
                      <button className="action-btn edit" title="Edit" onClick={() => handleEdit(t)}>
                        <Edit3 size={16} />
                      </button>
                      <button className="action-btn delete" title="Delete" onClick={() => deleteTransaction(t.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isTxModalOpen && (
        <TransactionModal 
          isOpen={isTxModalOpen} 
          onClose={() => setIsTxModalOpen(false)} 
          editTx={editingTx} 
        />
      )}

      {isCatModalOpen && (
        <CategoryModal 
          isOpen={isCatModalOpen} 
          onClose={() => setIsCatModalOpen(false)} 
        />
      )}
    </div>
  );
};
