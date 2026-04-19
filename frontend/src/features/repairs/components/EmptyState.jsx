import Button from '../../../components/ui/Button';

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-10 text-center text-slate-600 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-300">
      <p className="text-lg font-semibold text-slate-900 dark:text-white">{title}</p>
      <p className="mt-2 text-sm leading-6">{description}</p>
      {onAction && actionLabel && (
        <Button type="button" variant="primary" className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
