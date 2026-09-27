import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, FolderPlus } from 'lucide-react';

export const CategoryModal = ({ isOpen, onClose }) => {
  const { categories, addCategory, deleteCategory } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState('expense');

  if (!isOpen) return null;

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCategory({
      name: name.trim(),
      type
    });

    setName('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content cat-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="cat-modal-header">
          <FolderPlus size={24} className="icon-purple" />
          <h2>Manage Own Categories</h2>
        </div>
        <p className="cat-subtitle">Customize income & expense categories tailored to your student routine</p>

        {/* Add New Category Form */}
        <form onSubmit={handleAddCategory} className="cat-form">
          <div className="form-row">
            <div className="form-group flex-2">
              <input 
                type="text" 
                className="form-input" 
                placeholder="New Category Name (e.g. Campus Printing, Gym Pass)..." 
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group flex-1">
              <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} /> Add
            </button>
          </div>
        </form>

        {/* Existing Categories List */}
        <div className="cat-sections">
          <div className="cat-column">
            <h4>Expense Categories ({categories.filter(c => c.type === 'expense').length})</h4>
            <div className="cat-badge-list">
              {categories.filter(c => c.type === 'expense').map(c => (
                <div key={c.id} className="cat-item-pill">
                  <span>{c.name}</span>
                  {!c.is_default && (
                    <button className="del-cat-btn" onClick={() => deleteCategory(c.id)}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="cat-column">
            <h4>Income Categories ({categories.filter(c => c.type === 'income').length})</h4>
            <div className="cat-badge-list">
              {categories.filter(c => c.type === 'income').map(c => (
                <div key={c.id} className="cat-item-pill income">
                  <span>{c.name}</span>
                  {!c.is_default && (
                    <button className="del-cat-btn" onClick={() => deleteCategory(c.id)}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
