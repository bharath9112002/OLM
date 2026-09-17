import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Are you sure?', message, confirmLabel = 'Delete', danger = true }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-gray-600">{message}</p>
      <div className="mt-5 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
            danger ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
