import Button from './Button';
import Modal from './Modal';

function ConfirmDialog({ title, message, isOpen, onConfirm, onCancel }) {
  return (
    <Modal title={title} isOpen={isOpen} onClose={onCancel}>
      <div className="space-y-5">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm} className="w-full sm:w-auto">
          Confirm delete
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
