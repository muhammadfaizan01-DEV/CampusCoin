import React from 'react';
import { 
  Utensils, 
  Bus, 
  Home, 
  BookOpen, 
  Tv, 
  Film, 
  Package, 
  Wallet, 
  Briefcase, 
  GraduationCap, 
  Gift, 
  Coins 
} from 'lucide-react';

const ICON_MAP = {
  Utensils,
  Bus,
  Home,
  BookOpen,
  Tv,
  Film,
  Package,
  Wallet,
  Briefcase,
  GraduationCap,
  Gift,
  Coins
};

const COLOR_MAP = {
  exp_1: { bg: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(244,63,94,0.1) 100%)', color: '#f43f5e', border: 'rgba(244,63,94,0.3)' },
  exp_2: { bg: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(59,130,246,0.1) 100%)', color: '#06b6d4', border: 'rgba(6,182,212,0.3)' },
  exp_3: { bg: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(99,102,241,0.1) 100%)', color: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  exp_4: { bg: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(168,85,247,0.1) 100%)', color: '#8b5cf6', border: 'rgba(139,92,246,0.3)' },
  exp_5: { bg: 'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(236,72,153,0.1) 100%)', color: '#a855f7', border: 'rgba(168,85,247,0.3)' },
  exp_6: { bg: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.1) 100%)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  exp_7: { bg: 'linear-gradient(135deg, rgba(100,116,139,0.2) 0%, rgba(71,85,105,0.1) 100%)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' },

  inc_1: { bg: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.1) 100%)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
  inc_2: { bg: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(16,185,129,0.1) 100%)', color: '#06b6d4', border: 'rgba(6,182,212,0.3)' },
  inc_3: { bg: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(59,130,246,0.1) 100%)', color: '#8b5cf6', border: 'rgba(139,92,246,0.3)' },
  inc_4: { bg: 'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(244,63,94,0.1) 100%)', color: '#ec4899', border: 'rgba(236,72,153,0.3)' },
  inc_5: { bg: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(234,179,8,0.1) 100%)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' }
};

export const CategoryIcon = ({ iconName, categoryId, size = 18 }) => {
  const IconComponent = ICON_MAP[iconName] || Package;
  const style = COLOR_MAP[categoryId] || { bg: 'rgba(255,255,255,0.08)', color: '#94a3b8', border: 'rgba(255,255,255,0.1)' };

  return (
    <div 
      className="cat-icon-badge" 
      style={{ 
        background: style.bg, 
        color: style.color, 
        border: `1px solid ${style.border}`,
        width: size + 16,
        height: size + 16,
        borderRadius: '10px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 4px 12px ${style.border}`
      }}
    >
      <IconComponent size={size} />
    </div>
  );
};
