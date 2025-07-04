import { useState } from "react";

interface ShiftRequestModalProps {
  worker: string;
  date: string;
  currentShift: string;
  onClose: () => void;
  onSubmit: (request: {
    worker: string;
    date: string;
    currentShift: string;
    desiredShift: string;
    reason: string;
  }) => void;
}

function ShiftRequestModal({
  worker,
  date,
  currentShift,
  onClose,
  onSubmit,
}: ShiftRequestModalProps) {
  const [desiredShift, setDesiredShift] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!desiredShift || !reason.trim()) return;
    onSubmit({ worker, date, currentShift, desiredShift, reason });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-xl p-6 w-[90%] max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Request Shift Change</h2>
        <p className="mb-2">Date: <strong>{date}</strong></p>
        <p className="mb-4">Current Shift: <strong>{currentShift}</strong></p>

        <label className="block mb-2 font-medium">Desired Shift:</label>
        <select
          className="w-full p-2 rounded bg-gray-100 mb-4"
          value={desiredShift}
          onChange={(e) => setDesiredShift(e.target.value)}
        >
          <option value="">Select Shift</option>
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Night</option>
          <option>Off</option>
        </select>

        <label className="block mb-2 font-medium">Reason:</label>
        <textarea
          className="w-full p-2 rounded bg-gray-100 mb-4"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShiftRequestModal;
