import { useState, useEffect } from "react";
import WeekSelector from "./WeekSelector";
import ShiftPreferencesForm from "./ShiftPreferencesForm";
import ScheduleTable from "./ScheduleTable";
import ActionButtons from "./ActionButtons";
import ShiftRequestModal from "./ShiftRequestModal"; // your modal
import { generateSchedule } from "./generateSchedule";

const workers = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

function generateWeekISODates(startMonday: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startMonday);
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });
}

function generateWeekDates(startMonday: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startMonday);
    d.setDate(d.getDate() + i);
    return formatDate(d);
  });
}

function MonthlyBubble() {
  // === State ===
  const [preferences, setPreferences] = useState<{ [name: string]: string }>({});
  const [schedule, setSchedule] = useState<{ [weekIndex: number]: any }>({});
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [requestModalData, setRequestModalData] = useState<any | null>(null);
  const [weekMondays, setWeekMondays] = useState<Date[]>([]);

  // Set current date Mondays for 4 weeks
  useEffect(() => {
    const currentMonday = getMonday(new Date());
    const mondays: Date[] = [];
    for (let i = 0; i < 4; i++) {
      const monday = new Date(currentMonday);
      monday.setDate(monday.getDate() + i * 7);
      mondays.push(monday);
    }
    setWeekMondays(mondays);
  }, []);

  const currentWeekDates =
    weekMondays.length === 4 ? generateWeekDates(weekMondays[selectedWeekIndex]) : [];

  // === Permissions ===
  const isAdmin = true; // Toggle to false to test user mode

  // === Handlers ===
  const handleEdit = (worker: string, dayIndex: number) => {
    if (isAdmin) {
      setEditingDay(`${selectedWeekIndex}-${worker}-${dayIndex}`);
    } else {
      // Open request modal for user requests
      const date = currentWeekDates[dayIndex];
      const currentShift = schedule[selectedWeekIndex]?.[worker]?.[dayIndex] || "Off";
      setRequestModalData({ worker, date, currentShift, weekIndex: selectedWeekIndex });
    }
  };

  const handleShiftChange = (worker: string, dayIndex: number, shift: string) => {
    setSchedule((prev) => {
      const weekSchedule = { ...(prev[selectedWeekIndex] || {}) };
      const workerShifts = [...(weekSchedule[worker] || Array(7).fill("Off"))];
      workerShifts[dayIndex] = shift;
      weekSchedule[worker] = workerShifts;
      return { ...prev, [selectedWeekIndex]: weekSchedule };
    });
    setEditingDay(null);
  };

  const handleRequestSubmit = (request: any) => {
    setRequests((prev) => [...prev, request]);
    setRequestModalData(null);
  };

  const regenerate = () => {
    setSchedule({});
    setPreferences({});
    setEditingDay(null);
    setRequests([]);
  };

  const saveSchedule = () => {
    alert("Schedule saved! (Functionality to be implemented)");
  };

  const handlePreferenceChange = (worker: string, shift: string) => {
    setPreferences((prev) => ({ ...prev, [worker]: shift }));
  };

  return (
    <div className="text-white p-4">
      <h2 className="text-2xl mb-4">📅 Monthly Schedule (4 weeks)</h2>

      <WeekSelector
        weeks={weeks}
        selectedWeekIndex={selectedWeekIndex}
        onWeekChange={(i) => {
          setSelectedWeekIndex(i);
          setEditingDay(null);
          setRequestModalData(null);
        }}
      />

      {!schedule[selectedWeekIndex] ? (
        <ShiftPreferencesForm
          workers={workers.slice(0, 4)}
          preferences={preferences}
          onChange={handlePreferenceChange}
          onGenerate={() =>
            generateSchedule({
              workers,
              preferences,
              selectedWeekIndex,
              setSchedule,
            })
          }
        />
      ) : (
        <>
         <ScheduleTable
          schedule={schedule[selectedWeekIndex]}
          workers={workers}
          editingDay={editingDay}
          onEdit={handleEdit}
          onShiftChange={handleShiftChange}
          dayLabels={currentWeekDates} // "dd/mm" format
          dayDates={weekMondays.length === 4 ? generateWeekISODates(weekMondays[selectedWeekIndex]) : []}
          selectedWeekIndex={selectedWeekIndex}
          isAdmin={isAdmin}
        />
          <ActionButtons onRegenerate={regenerate} onSave={saveSchedule} />

          {requests.length > 0 && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <h3 className="font-semibold mb-2">📥 Requests</h3>
              <ul className="text-sm">
                {requests.map((req, i) => (
                  <li key={i}>
                    {req.worker} requested <strong>{req.desiredShift}</strong> on {req.date} (Reason:{" "}
                    {req.reason})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {requestModalData && (
        <ShiftRequestModal
          {...requestModalData}
          onClose={() => setRequestModalData(null)}
          onSubmit={handleRequestSubmit}
        />
      )}
    </div>
  );
}

export default MonthlyBubble;
