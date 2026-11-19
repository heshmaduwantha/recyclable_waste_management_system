import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { adminTheme } from '../../theme/admin';
import { Download } from 'lucide-react';
import { adminService, ESGReportItem } from '../../services/admin.service';

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<ESGReportItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadReports() {
      try {
        const data = await adminService.getReports();
        if (isMounted) setReports(data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      }
    }
    loadReports();
    return () => { isMounted = false; };
  }, []);

  const handleExportCsv = () => {
    const headers = ['Metric Label', 'Metric Value', 'Notes'];
    const rows = reports.map(r => [`"${r.label}"`, `"${r.value}"`, `"${r.note}"`]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ESG_Impact_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Header title="Analytics & Impact Reports" subtitle="ESG compliance metrics, carbon reduction, and waste audits" />

      <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: adminTheme.colors.textPrimary }}>Environmental Impact Summary</h3>
          <button
            onClick={handleExportCsv}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: adminTheme.colors.primary,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: adminTheme.borderRadius.md,
              padding: '10px 18px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Download size={18} />
            <span>Export ESG CSV Report</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {reports.map((item, idx) => (
            <div key={idx} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: adminTheme.borderRadius.lg,
              padding: '24px',
              border: `1px solid ${adminTheme.colors.border}`,
              boxShadow: adminTheme.shadows.sm
            }}>
              <div style={{ fontSize: '13px', color: adminTheme.colors.textSecondary, fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: adminTheme.colors.accent, margin: '12px 0 6px 0' }}>{item.value}</div>
              <div style={{ fontSize: '12px', color: adminTheme.colors.textMuted }}>{item.note}</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};
