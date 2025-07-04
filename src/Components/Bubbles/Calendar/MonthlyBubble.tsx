import { useState, useEffect } from "react";
import WeekSelector from "./WeekSelector";
import ShiftPreferencesForm from "./ShiftPreferencesForm";
import ScheduleTable from "./ScheduleTable";
import ActionButtons from "./ActionButtons";
import { generateSchedule } from "./generateSchedule"; 

const workers = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

// Utility to get Monday date of the current week
function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// Format date as "dd.MM"
function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });
}

// Generate an array of 7 dates starting from a Monday
function generateWeekDates(startMonday: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startMonday);
    d.setDate(d.getDate() + i);
    return formatDate(d);
  });
}

function MonthlyBubble() {
  // Preferences stay global
  const [preferences, setPreferences] = useState<{ [name: string]: string }>({});

  // Store schedule per week index (0..3)
  const [schedule, setSchedule] = useState<{ [weekIndex: number]: any }>({});

  // Track which week is selected
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  // Editing day string with week index: "week-worker-day"
  const [editingDay, setEditingDay] = useState<string | null>(null);

  // Store actual Monday dates for each week (4 weeks starting from current Monday)
  const [weekMondays, setWeekMondays] = useState<Date[]>([]);

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


  // Handlers
  const handleEdit = (worker: string, dayIndex: number) => {
    setEditingDay(`${selectedWeekIndex}-${worker}-${dayIndex}`);
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

  const regenerate = () => {
    setSchedule({});
    setPreferences({});
    setEditingDay(null);
  };

  const saveSchedule = () => {
    alert("Schedule saved! (Functionality to be implemented)");
  };

  const handlePreferenceChange = (worker: string, shift: string) => {
    setPreferences((prev) => ({ ...prev, [worker]: shift }));
  };

  // Dates for the currently selected week to show in the table header
  const currentWeekDates =
    weekMondays.length === 4
      ? generateWeekDates(weekMondays[selectedWeekIndex])
      : [];

  return (
    <div className="text-white p-4">
      <h2 className="text-2xl mb-4">📅 Monthly Schedule (4 weeks)</h2>

      <WeekSelector
        weeks={weeks}
        selectedWeekIndex={selectedWeekIndex}
        onWeekChange={(i) => {
          setSelectedWeekIndex(i);
          setEditingDay(null);
        }}
      />

        {!schedule[selectedWeekIndex] ? (
          <ShiftPreferencesForm
            workers={workers.slice(0, 4)}
            preferences={preferences}
            onChange={handlePreferenceChange}
            onGenerate={() =>
              generateSchedule({ workers, preferences, selectedWeekIndex, setSchedule })
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
            dayLabels={currentWeekDates}
            selectedWeekIndex = {selectedWeekIndex} // pass dates as header labels
          />

          <ActionButtons onRegenerate={regenerate} onSave={saveSchedule} />
        </>
      )}
    </div>
  );
}

export default MonthlyBubble;
