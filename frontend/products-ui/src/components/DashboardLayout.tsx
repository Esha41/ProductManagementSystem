import type { ReactNode } from 'react';

export type DashboardPage = 'list' | 'create';

interface DashboardLayoutProps {
  activePage: DashboardPage;
  onPageChange: (page: DashboardPage) => void;
  healthStatus: string;
  onLogout: () => void;
  children: ReactNode;
}

const navItems: { page: DashboardPage; label: string }[] = [
  { page: 'list', label: 'Product List' },
  { page: 'create', label: 'Create Product' },
];

export function DashboardLayout({
  activePage,
  onPageChange,
  healthStatus,
  onLogout,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <p className="sidebar-title">Product Management System</p>
        <nav className="sidebar-nav">
          {navItems.map(({ page, label }) => (
            <button
              key={page}
              type="button"
              className={`nav-item${activePage === page ? ' active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h2>{activePage === 'list' ? 'Product List' : 'Create Product'}</h2>
          <div className="header-actions">
            <div className="status-pill" data-state={healthStatus === 'OK' ? 'ok' : 'warn'}>
              Health: {healthStatus}
            </div>
            <button type="button" className="ghost-button" onClick={onLogout}>
              Sign out
            </button>
          </div>
        </header>

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
