import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import useToast from '../../../hooks/useToast';

function CreateRepairModal({ isOpen, onClose, createRepair }) {
  const [form, setForm] = useState({ title: '', client_name: '', description: '', status: 'pending' });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await createRepair(form);
      showToast('Repair request saved successfully.', 'success');
      setForm({ title: '', client_name: '', description: '', status: 'pending' });
      onClose();
    } catch (err) {
      showToast(err.message || 'Unable to create repair.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title="New repair request" isOpen={isOpen} onClose={onClose}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Repair title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="e.g. Replace vibration motor"
        />

        <Input
          label="Client name"
          name="client_name"
          value={form.client_name}
          onChange={handleChange}
          required
          placeholder="Client or company name"
        />

        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Describe the issue in a few sentences"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</span>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="pending">Pending</option>
            <option value="in progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={submitting}>
            {submitting ? 'Saving...' : 'Create repair'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateRepairModal;
