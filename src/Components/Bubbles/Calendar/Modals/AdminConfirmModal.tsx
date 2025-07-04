interface AdminConfirmModalProps {
  worker: string;
  date: string;
  newShift: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function AdminConfirmModal({ worker, date, newShift, onConfirm, onCancel }: AdminConfirmModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 text-black w-80 shadow-lg">
        <p className="mb-4 text-center font-semibold">
          Change shift for <strong>{worker}</strong> on <strong>{date}</strong> to <strong>{newShift}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default AdminConfirmModal;
