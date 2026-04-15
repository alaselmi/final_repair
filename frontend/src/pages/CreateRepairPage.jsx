import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Button from '../components/ui/Button';
import ToastContainer from '../components/ui/ToastContainer';
import useToast from '../hooks/useToast';
import { createRepair } from '../services/repairService';

function CreateRepairPage() {
  const [form, setForm] = useState({ title: '', client_name: '', description: '', status: 'pending' });
  const [submitting, setSubmitting] = useState(false);
  const { toast, showToast, clearToast } = useToast();
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createRepair(form);
      showToast('Repair request created successfully', 'success');
      setTimeout(() => navigate('/repairs'), 500);
    } catch (err) {
      showToast(err.message || 'Unable to create repair', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:flex-row">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar />
          <section className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-8 shadow-soft dark:border-slate-700/80 dark:bg-slate-950/95">
            <div className="mb-6">
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Create new repair</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Add a repair request and assign it to the right status for your operations team.</p>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="space-y-6 rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/80 dark:bg-slate-900/95">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Repair title</span>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="e.g. Replace camera module"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Client name</span>
                  <input
                    type="text"
                    name="client_name"
                    value={form.client_name}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Client name"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Details</span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="6"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Describe the repair issue"
                  />
                </label>
              </div>
              <div className="space-y-6 rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/80 dark:bg-slate-900/95">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="pending">Pending</option>
                    <option value="in progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                </label>

                <div className="rounded-[1.75rem] bg-white p-6 shadow-sm dark:bg-slate-950">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Publish</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create a repair request and send it to the dashboard list.</p>
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Creating...' : 'Create repair'}
                </Button>
              </div>
            </form>
          </section>
        </main>
      </div>
      <ToastContainer message={toast.message} type={toast.type} onClose={clearToast} />
    </div>
  );
}

export default CreateRepairPage;
