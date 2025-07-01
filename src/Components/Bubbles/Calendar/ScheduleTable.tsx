import clsx from "clsx";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  workers: string[];
  schedule: any;
}

function ScheduleTable({ workers, schedule }: Props) {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full border border-white/20">
        <thead>
          <tr>
            <th className="p-2 border border-white/20">Worker</th>
            {days.map((day) => (
              <th key={day} className="p-2 border border-white/20">
                {day}
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
                  className={clsx(
                    "p-2 border border-white/20",
                    shift === "Off" && "text-gray-400 italic",
                    shift === "Night" && "text-purple-400",
                    shift === "Morning" && "text-green-300",
                    shift === "Afternoon" && "text-yellow-300"
                  )}
                >
                  {shift}
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
