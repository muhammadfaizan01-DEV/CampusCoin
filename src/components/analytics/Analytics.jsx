import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title 
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { PieChart, Download, FileText, Calendar, Filter } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title
);

export const Analytics = () => {
  const { transactions, categories } = useApp();
  const reportRef = useRef(null);

  const [dateRange, setDateRange] = useState('6months'); // 'month', '3months', '6months'
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  const now = new Date();

  // Filter transactions according to selected range
  const filteredTxs = transactions.filter(t => {
    const d = new Date(t.date);
    const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    
    let inRange = true;
    if (dateRange === 'month') inRange = monthsAgo === 0;
    else if (dateRange === '3months') inRange = monthsAgo <= 3;
    else if (dateRange === '6months') inRange = monthsAgo <= 6;

    const matchesCat = selectedCatFilter === 'all' || t.category_id === selectedCatFilter;

    return inRange && matchesCat;
  });

  // Chart 1: Category Breakdown (Doughnut)
  const catTotals = {};
  filteredTxs.filter(t => t.type === 'expense').forEach(t => {
    const cat = categories.find(c => c.id === t.category_id);
    const name = cat ? cat.name : 'Other';
    catTotals[name] = (catTotals[name] || 0) + Number(t.amount);
  });

  const doughnutData = {
    labels: Object.keys(catTotals),
    datasets: [
      {
        data: Object.values(catTotals),
        backgroundColor: [
          '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'
        ],
        borderColor: 'rgba(15, 23, 42, 0.8)',
        borderWidth: 2
      }
    ]
  };

  // Chart 2: 6-Month Income vs Expense Trend (Bar Chart)
  const monthLabels = [];
  const incomeTrend = [];
  const expenseTrend = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('default', { month: 'short' });
    monthLabels.push(label);

    const monthTxs = transactions.filter(t => {
      const td = new Date(t.date);
      return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
    });

    const inc = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const exp = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

    incomeTrend.push(inc);
    expenseTrend.push(exp);
  }

  const barChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Income ($)',
        data: incomeTrend,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 6
      },
      {
        label: 'Expense ($)',
        data: expenseTrend,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 6
      }
    ]
  };

  // PDF Export Function
  const handleExportPDF = () => {
    if (!reportRef.current) return;
    html2canvas(reportRef.current, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CampusCoin_Monthly_Financial_Report_${dateRange}.pdf`);
    });
  };

  return (
    <div className="analytics-page">
      <div className="page-header glass-card">
        <div>
          <h2>Financial Reports & Analytics</h2>
          <p className="subtitle">Comprehensive visual breakdown of spending habits, income sources, and multi-month trends</p>
        </div>

        <div className="header-actions">
          <button className="btn btn-primary btn-sm" onClick={handleExportPDF}>
            <Download size={16} /> Export PDF Report
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="filter-bar glass-card">
        <div className="filter-controls">
          <div className="filter-item">
            <Calendar size={16} />
            <select value={dateRange} onChange={e => setDateRange(e.target.value)}>
              <option value="month">Current Month Only</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
            </select>
          </div>

          <div className="filter-item">
            <Filter size={16} />
            <select value={selectedCatFilter} onChange={e => setSelectedCatFilter(e.target.value)}>
              <option value="all">All Expense Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exportable Report Section */}
      <div ref={reportRef} className="report-container">
        <div className="charts-grid">
          {/* Doughnut Chart Card */}
          <div className="glass-card chart-card">
            <div className="widget-header">
              <div className="title-box">
                <PieChart className="icon-green" size={20} />
                <h3>Category Expense Breakdown</h3>
              </div>
            </div>
            <div className="chart-wrapper doughnut-wrapper">
              {Object.keys(catTotals).length > 0 ? (
                <Doughnut 
                  data={doughnutData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'right', labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } } }
                    }
                  }} 
                />
              ) : (
                <div className="no-chart-data">No expense transactions recorded in this date range.</div>
              )}
            </div>
          </div>

          {/* Bar Chart Card */}
          <div className="glass-card chart-card">
            <div className="widget-header">
              <div className="title-box">
                <FileText className="icon-purple" size={20} />
                <h3>6-Month Income vs Expense Trend</h3>
              </div>
            </div>
            <div className="chart-wrapper bar-wrapper">
              <Bar 
                data={barChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top', labels: { color: '#94a3b8' } }
                  },
                  scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                  }
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
