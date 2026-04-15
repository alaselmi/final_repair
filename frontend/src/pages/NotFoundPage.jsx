import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200/80 bg-white/95 p-12 text-center shadow-soft dark:border-slate-700/80 dark:bg-slate-950/95">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-600">404 error</p>
        <h1 className="mt-6 text-5xl font-semibold text-slate-900 dark:text-white">Page not found</h1>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Looks like the page you were searching for doesn't exist. Let’s get you back on track.</p>
        <Link to="/">
          <Button className="mt-8">Return home</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
