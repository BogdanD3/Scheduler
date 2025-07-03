interface Props {
  workers: string[];
  preferences: { [name: string]: string };
  onChange: (worker: string, shift: string) => void;
  onGenerate: () => void;
}

function ShiftPreferencesForm({ workers, preferences, onChange, onGenerate }: Props) {
  return (
    <>
      <p className="mb-2">Set preferred shifts for each worker (except Eve - night shift):</p>
      {workers.map((worker) => (
        <div key={worker} className="mb-2 flex items-center gap-2">
          <label className="w-20">{worker}:</label>
          <select
            value={preferences[worker] || ""}
            onChange={(e) => onChange(worker, e.target.value)}
            className="bg-white/10 p-2 rounded text-black"
          >
            <option value="">Select shift</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Night">Night</option> 

          </select>
        </div>
      ))}
      <button
        onClick={onGenerate}
        className="mt-4 bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
      >
        Generate Schedule
      </button>
    </>
  );
}

export default ShiftPreferencesForm;
