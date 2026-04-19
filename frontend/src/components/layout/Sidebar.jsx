import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

function Sidebar({ isOpen = true }) {
  const auth = useContext(AuthContext);
  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/repairs', label: 'Repairs' },
    ...(auth.user?.role === 'admin' ? [{ to: '/users', label: 'Users' }] : []),
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="flex h-full w-full max-w-xs flex-col gap-8 rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-soft backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-950/90 lg:w-72">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-100 px-4 py-3 dark:bg-slate-900/80">
          <div className="h-10 w-10 rounded-2xl bg-sky-500 text-center text-lg font-semibold leading-10 text-white shadow-lg shadow-sky-500/20">R</div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Repair</p>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Flow</h2>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">A premium workspace for repair teams with fast navigation, status tracking, and modern insights.</p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-3xl px-4 py-3 text-sm font-semibold transition duration-300 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-[1.75rem] border border-slate-200/80 bg-slate-50/80 p-5 text-sm text-slate-600 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-300">
        <p className="font-semibold text-slate-900 dark:text-white">Focus mode</p>
        <p className="mt-2 leading-6">Keep repair operations optimized with fast access to your active work.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
