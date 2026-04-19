import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const routeMeta = {
  '/': {
    category: 'Overview',
    title: 'Dashboard',
    description: 'Your command center for repair operations and team performance.',
  },
  '/repairs': {
    category: 'Repairs',
    title: 'Repair queue',
    description: 'Search, filter and manage repair requests efficiently.',
  },
  '/users': {
    category: 'Users',
    title: 'User management',
    description: 'Control platform access and review account status.',
  },
};

function MainLayout({ children, topbarProps = {}, sidebarProps = {} }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const routeInfo = useMemo(() => routeMeta[location.pathname] || routeMeta['/'], [location.pathname]);
  const title = topbarProps.title || routeInfo.title;
  const subtitle = topbarProps.subtitle || routeInfo.description;
  const label = topbarProps.label || routeInfo.category;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:flex-row">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 space-y-6">
          <Topbar
            {...topbarProps}
            label={label}
            title={title}
            subtitle={subtitle}
            sidebarOpen={isSidebarOpen}
            onToggleSidebar={sidebarProps.collapsible ? () => setIsSidebarOpen((open) => !open) : undefined}
          />
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
