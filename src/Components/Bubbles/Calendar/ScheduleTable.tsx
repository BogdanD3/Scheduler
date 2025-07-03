import clsx from "clsx";

interface Props {
  workers: string[];
  schedule: any;
  editingDay: string | null;
  onEdit: (worker: string, dayIndex: number) => void;
  onShiftChange: (worker: string, dayIndex: number, shift: string) => void;
  dayLabels: string[]; // new prop for dates, length 7
  selectedWeekIndex: number;
}

function ScheduleTable({
  schedule,
  workers,
  editingDay,
  onEdit,
  onShiftChange,
  dayLabels,
  selectedWeekIndex
}: Props) {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full border border-white/20">
        <thead>
          <tr>
            <th className="p-2 border border-white/20">Worker</th>
            {dayLabels.map((date, idx) => (
              <th key={idx} className="p-2 border border-white/20">
                {date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker}>
              <td className="p-2 border border-white/20 font-semibold">{worker}</td>
              {schedule[worker].map((shift: string, idx: number) => (
                <td
                  key={`${worker}-${idx}`}
                  className="p-2 border border-white/20 cursor-pointer hover:bg-white/10"
                  onClick={() => onEdit(worker, idx)}
                >
                  {editingDay === `${worker}-${idx}` || editingDay === `${selectedWeekIndex}-${worker}-${idx}` ? (
                    <select
                      autoFocus
                      className="bg-white/10 p-1 rounded"
                      value={shift}
                      onChange={(e) => onShiftChange(worker, idx, e.target.value)}
                    >
                      <option>Morning</option>
                      <option>Afternoon</option>
                      <option>Night</option>
                      <option>Off</option>
                    </select>
                  ) : (
                        <span
                          className={clsx(
                            shift === "Off" && "text-gray-400 italic",
                            shift === "Night" && "text-purple-500",
                            shift === "Morning" && "text-green-500",
                            shift === "Afternoon" && "text-yellow-500"
                          )}
                        >
                          {shift}
                        </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleTable;
