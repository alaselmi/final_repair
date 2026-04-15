import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';

function LoginPage() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isAuthenticated, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      await auth.login({ email, password });
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-slate-900/90 p-10 shadow-soft backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Repair SaaS</p>
          <h1 className="mt-6 text-4xl font-semibold text-white">Welcome back</h1>
          <p className="mt-4 max-w-md text-sm text-slate-400">Access your repair dashboard, manage tickets, and stay on top of service delivery with a premium workflow.</p>
          <div className="mt-10 space-y-4 rounded-[1.75rem] bg-slate-950/80 p-6 text-sm text-slate-400 shadow-lg shadow-slate-950/30">
            <p className="font-semibold text-white">Fast access</p>
            <p>Use your email and password to log in and continue managing repairs in one place.</p>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-10 shadow-soft dark:bg-slate-950/95">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Repair SaaS</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">Sign in to your account</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Secure access to repairs, dashboards, and client workflows.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-200">{error}</div>}

            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="name@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Enter your password"
              />
            </label>

            <Button className="w-full" type="submit" disabled={auth.loading}>
              {auth.loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
