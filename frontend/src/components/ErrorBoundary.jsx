import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 px-4 py-20 text-center dark:bg-slate-950">
          <div className="mx-auto max-w-xl rounded-[2rem] border border-rose-200/80 bg-white p-12 shadow-soft dark:border-rose-800/80 dark:bg-slate-950/95">
            <p className="text-sm uppercase tracking-[0.3em] text-rose-600">Something went wrong</p>
            <h1 className="mt-6 text-4xl font-semibold text-slate-900 dark:text-white">Unexpected error</h1>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Refresh the page or try again later. If the issue persists, contact support.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-8 rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
