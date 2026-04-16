import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'technician', label: 'Technician' },
  { value: 'user', label: 'User' },
];

function EditUserModal({ user, isOpen, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', role: user.role || 'user' });
    }
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await onSave({ ...user, ...form });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <Modal title="Edit user" isOpen={isOpen} onClose={onClose}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Role</span>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-3xl border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EditUserModal;
