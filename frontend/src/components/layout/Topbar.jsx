import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';

function Topbar({ onSearch, onCreate }) {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-soft backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-950/90 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-600">Overview</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">Hi {user?.name?.split(' ')[0] || 'there'}, ready to ship repairs?</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Everything you need to manage repair requests and stay on top of service goals.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-auto">
          <input
            type="search"
            placeholder="Search repairs..."
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
            onChange={(event) => onSearch?.(event.target.value)}
          />
        </div>
        <div className="inline-flex flex-wrap items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {onCreate && (
            <button
              type="button"
              onClick={onCreate}
              className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              New repair
            </button>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button type="button" onClick={logout} className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
