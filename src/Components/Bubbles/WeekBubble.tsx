import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const workers = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
const shifts = ["Morning", "Afternoon"];

function getNextMonday(date = new Date()) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day === 0 ? 1 : 8) - day;
  result.setDate(result.getDate() + diff);
  return result;
}

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

function WeekBubble() {
  const [preferences, setPreferences] = useState<{ [name: string]: string }>({});
  const [schedule, setSchedule] = useState<any>(null);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekDates = generateWeek(currentWeek);

  const handlePreference = (name: string, shift: string) => {
    setPreferences((prev) => ({ ...prev, [name]: shift }));
  };

  const generateSchedule = () => {
    const result: any = {};
    const nightWorker = workers[4];
    const daysOff = [...days];
    const nightDaysOff: string[] = [];

    // Assign 2 random days off for the night shift worker
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

    setSchedule(result);
  };

  const handleEdit = (worker: string, dayIndex: number) => {
    setEditingDay(`${worker}-${dayIndex}`);
  };

  const handleShiftChange = (worker: string, dayIndex: number, shift: string) => {
    setSchedule((prev: any) => {
      const updated = { ...prev };
      updated[worker][dayIndex] = shift;
      return updated;
    });
    setEditingDay(null);
  };

  const goToNextWeek = () => {
    const next = new Date(currentWeek);
    next.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(next);
    setSchedule(null);
    setPreferences({});
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl mb-4">📅 Weekly Schedule</h2>
      <p className="mb-2">Select preferred shifts for each worker (except the night shift person):</p>
      {workers.slice(0, 4).map((name) => (
        <div key={name} className="mb-2">
          <label className="mr-4">{name}:</label>
          <select
            className="bg-white/10 p-2 rounded"
            value={preferences[name] || ""}
            onChange={(e) => handlePreference(name, e.target.value)}
          >
            <option value="">Select</option>
            {shifts.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      ))}

      {!schedule && (
        <button
          className="mt-4 bg-white/20 px-4 py-2 rounded hover:bg-white/30"
          onClick={generateSchedule}
        >
          Generate Schedule
        </button>
      )}

      {schedule && (
        <>
          <div className="overflow-x-auto mt-6">
            <table className="w-full border border-white/20">
              <thead>
                <tr>
                  <th className="p-2 border border-white/20">Worker</th>
                  {weekDates.map((date) => (
                    <th key={date} className="p-2 border border-white/20">
                      {date.slice(5)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workers.map((worker) => (
                  <tr key={worker}>
                    <td className="p-2 border border-white/20 font-semibold">{worker}</td>
                    {schedule[worker].map((shift: string, idx: number) => {
                      const key = `${worker}-${idx}`;
                      return (
                        <td
                          key={key}
                          className={clsx(
                            "p-2 border border-white/20 cursor-pointer hover:bg-white/10",
                            shift === "Off" && "text-gray-400 italic",
                            shift === "Night" && "text-purple-400",
                            shift === "Morning" && "text-green-300",
                            shift === "Afternoon" && "text-yellow-300"
                          )}
                          onClick={() => handleEdit(worker, idx)}
                        >
                          {editingDay === key ? (
                            <select
                              autoFocus
                              className="bg-white/10 p-1 rounded"
                              value={shift}
                              onChange={(e) => handleShiftChange(worker, idx, e.target.value)}
                            >
                              <option>Morning</option>
                              <option>Afternoon</option>
                              <option>Night</option>
                              <option>Off</option>
                            </select>
                          ) : (
                            shift
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={goToNextWeek}
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              ➕ Next Week
            </button>
            <button
              onClick={generateSchedule}
              className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
            >
              🔄 Regenerate
            </button>
            <button
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              // Placeholder for future save logic
            >
              ✅ Save
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default WeekBubble;