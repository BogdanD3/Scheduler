import clsx from "clsx";

interface Props {
  workers: string[];
  schedule: { [worker: string]: string[] };
  editingDay: string | null;
  onEdit: (worker: string, dayIndex: number) => void;
  onShiftChange: (worker: string, dayIndex: number, shift: string) => void;
  dayLabels: string[];
  dayDates: string[];
  selectedWeekIndex: number;
  isAdmin?: boolean;
  onRequestShift?: (worker: string, date: string, currentShift: string) => void;
}

function ScheduleTable({
  workers,
  schedule,
  editingDay,
  onEdit,
  onShiftChange,
  dayLabels,
  dayDates,
  selectedWeekIndex,
  isAdmin = true,
  onRequestShift,
}: Props) {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full border border-white/20">
        <thead>
          <tr>
            <th className="p-2 border border-white/20">Worker</th>
            {dayLabels.map((label, idx) => (
              <th key={idx} className="p-2 border border-white/20">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker}>
              <td className="p-2 border border-white/20 font-semibold">{worker}</td>
              {(schedule[worker] || []).map((shift, idx) => {
                const key = `${worker}-${idx}`;
                const isEditing =
                  editingDay === key || editingDay === `${selectedWeekIndex}-${key}`;

                return (
                  <td
                    key={key}
                    className="p-2 border border-white/20 cursor-pointer hover:bg-white/10"
                    onClick={() => {
                      if (isAdmin) {
                        onEdit(worker, idx);
                      } else if (onRequestShift) {
                        onRequestShift(worker, dayDates[idx], shift);
                      }
                    }}
                  >
                    {isAdmin && isEditing ? (
                      <select
                        autoFocus
                        className="bg-white/10 text-white rounded-xl px-3 py-1 shadow-inner backdrop-blur-md outline-none focus:ring-2 focus:ring-blue-300"
                        value={shift}
                        onChange={(e) =>
                          onShiftChange(worker, idx, e.target.value)
                        }
                      >
                        <option className="bg-black text-green-300">Morning</option>
                        <option className="bg-black text-orange-300">Afternoon</option>
                        <option className="bg-black text-purple-300">Night</option>
                        <option className="bg-black text-gray-300">Off</option>
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
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleTable;
