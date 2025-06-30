import { useState } from "react";
import { motion } from "framer-motion";
// import { FaPen } from "react-icons/fa";

const workers = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
const shifts = ["Morning", "Afternoon"];

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function generateWeek(startDate: Date) {
  const week: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    week.push(formatDate(date));
  }
  return week;
}

function generateBlankWeeks(count: number): Date[] {
  const weeks: Date[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const monday = new Date(now);
  const day = monday.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  monday.setDate(now.getDate() + diff);

  for (let i = 0; i < count; i++) {
    const nextWeek = new Date(monday);
    nextWeek.setDate(monday.getDate() + i * 7);
    weeks.push(nextWeek);
  }
  return weeks;
}

function generateSchedule(preferences: { [name: string]: string }) {
  const result: any = {};
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const nightWorker = workers[4];
  const nightDaysOff: string[] = [];

  while (nightDaysOff.length < 2) {
    const day = days[Math.floor(Math.random() * days.length)];
    if (!nightDaysOff.includes(day)) nightDaysOff.push(day);
  }
  result[nightWorker] = days.map((day) =>
    nightDaysOff.includes(day) ? "Off" : "Night"
  );

  for (let i = 0; i < 4; i++) {
    const name = workers[i];
    const preferred = preferences[name];
    const freeDay = days[Math.floor(Math.random() * days.length)];

    result[name] = days.map((day) => {
      if (day === freeDay) return "Off";
      return preferred || shifts[Math.floor(Math.random() * shifts.length)];
    });
  }
  return result;
}

function CalendarBubble() {
  const weeks = generateBlankWeeks(4);
  const [schedules, setSchedules] = useState<{ [key: string]: any }>({});
  const [editingWeek, setEditingWeek] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<{ [name: string]: string }>({});

  const handleGenerate = (weekKey: string) => {
    const schedule = generateSchedule(preferences);
    setSchedules((prev) => ({ ...prev, [weekKey]: schedule }));
    setEditingWeek(null);
    setPreferences({});
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl mb-4">📆 Monthly Calendar</h2>
      {weeks.map((startDate) => {
        const weekKey = formatDate(startDate);
        const isScheduled = !!schedules[weekKey];

        return (
          <div
            key={weekKey}
            className="mb-4 p-4 rounded-xl bg-white/5 backdrop-blur border border-white/20"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">
                Week of {weekKey}
              </h3>
              {!isScheduled && (
                <button
                  onClick={() => setEditingWeek(weekKey)}
                  className="text-white hover:text-blue-300"
                >
                  {/* {<FaPen />} */}edit
                </button>
              )}
            </div>

            {editingWeek === weekKey && (
              <div className="mb-4">
                {workers.slice(0, 4).map((name) => (
                  <div key={name} className="mb-2">
                    <label className="mr-4">{name}:</label>
                    <select
                      className="bg-white/10 p-2 rounded"
                      value={preferences[name] || ""}
                      onChange={(e) =>
                        setPreferences((prev) => ({ ...prev, [name]: e.target.value }))
                      }
                    >
                      <option value="">Select</option>
                      {shifts.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <button
                  onClick={() => handleGenerate(weekKey)}
                  className="mt-2 bg-green-500 px-4 py-2 rounded hover:bg-green-600"
                >
                  ✅ Generate Schedule
                </button>
              </div>
            )}

            {isScheduled && (
              <table className="w-full text-sm border border-white/10 mt-2">
                <thead>
                  <tr>
                    <th className="p-1 border border-white/10">Worker</th>
                    {generateWeek(startDate).map((d) => (
                      <th key={d} className="p-1 border border-white/10">{d.slice(5)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {workers.map((w) => (
                    <tr key={w}>
                      <td className="p-1 border border-white/10 font-semibold">{w}</td>
                      {schedules[weekKey][w].map((s: string, i: number) => (
                        <td
                          key={i}
                          className="p-1 border border-white/10 text-center"
                        >
                          {s}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CalendarBubble;
