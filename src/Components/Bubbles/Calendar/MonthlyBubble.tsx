import { useState, useEffect } from "react";
import WeekSelector from "./WeekSelector";
import ShiftPreferencesForm from "./ShiftPreferencesForm";
import ScheduleTable from "./ScheduleTable";
import ActionButtons from "./ActionButtons";

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

  // Generate schedule for the currently selected week
  const generateSchedule = () => {
    const result: any = {};
    const offDaysSet = new Set<number>();
    const eve = "Eve";
    const otherWorkers = workers.filter((w) => w !== eve);

    // 1. Eve's fixed night shifts (except 2 random off days)
    const eveOffStart = Math.floor(Math.random() * 6);
    const eveOffDays = [eveOffStart, (eveOffStart + 1) % 7];

    result[eve] = Array(7)
      .fill("Night")
      .map((_, i) => (eveOffDays.includes(i) ? "Off" : "Night"));

    const shiftCountsPerDay: Record<number, Record<string, number>> = {};
    for (let i = 0; i < 7; i++) {
      shiftCountsPerDay[i] = { Morning: 0, Afternoon: 0, Night: 0 };
      if (!eveOffDays.includes(i)) shiftCountsPerDay[i]["Night"]++;
    }

    // 2. Determine night fill-in
    const preferredNightWorkers = otherWorkers.filter(
      (w) => preferences[w] === "Night"
    );
    const nightFillIn =
      preferredNightWorkers.length > 0
        ? preferredNightWorkers[0]
        : otherWorkers[Math.floor(Math.random() * otherWorkers.length)];

    const dayWorkers = otherWorkers.filter((w) => w !== nightFillIn);

    result[nightFillIn] = Array(7).fill(null);

    // 3. Night fill-in covers Eve's off nights
    for (const day of eveOffDays) {
      result[nightFillIn][day] = "Night";
      shiftCountsPerDay[day]["Night"]++;
    }

    // 4. Night fill-in gets 2 days off after those shifts
    const fillInOffDay1 = (eveOffDays[1] + 1) % 7;
    const fillInOffDay2 = (fillInOffDay1 + 1) % 7;

    result[nightFillIn][fillInOffDay1] = "Off";
    result[nightFillIn][fillInOffDay2] = "Off";

    shiftCountsPerDay[fillInOffDay1] ??= {
      Morning: 0,
      Afternoon: 0,
      Night: 0,
    };
    shiftCountsPerDay[fillInOffDay2] ??= {
      Morning: 0,
      Afternoon: 0,
      Night: 0,
    };

    // 5. Fill in remaining days for nightFillIn using their preference if possible
    for (let i = 0; i < 7; i++) {
      if (result[nightFillIn][i]) continue;

      let shift = "Off";
      if (shiftCountsPerDay[i]["Morning"] < 2) {
        shift = "Morning";
      } else if (shiftCountsPerDay[i]["Afternoon"] < 2) {
        shift = "Afternoon";
      }

      result[nightFillIn][i] = shift;
      if (shift !== "Off") shiftCountsPerDay[i][shift]++;
    }

    // 6. Assign shifts for remaining day workers using preferences if available
    for (const worker of dayWorkers) {
      result[worker] = Array(7).fill(null);

      // Determine a free day for this worker
      let freeDay = -1;
      for (let tries = 0; tries < 20; tries++) {
        const d = Math.floor(Math.random() * 7);
        if (
          !offDaysSet.has(d) &&
          !eveOffDays.includes(d) &&
          result[nightFillIn][d] !== "Off"
        ) {
          freeDay = d;
          offDaysSet.add(d);
          break;
        }
      }

      if (freeDay === -1) {
        for (let d = 0; d < 7; d++) {
          if (!offDaysSet.has(d)) {
            freeDay = d;
            offDaysSet.add(d);
            break;
          }
        }
      }

      const preferred = preferences[worker] || null;

      for (let i = 0; i < 7; i++) {
        if (i === freeDay) {
          result[worker][i] = "Off";
          continue;
        }

        let shift = "Off";
        if (preferred && shiftCountsPerDay[i][preferred] < 2) {
          shift = preferred;
        } else if (shiftCountsPerDay[i]["Morning"] < 2) {
          shift = "Morning";
        } else if (shiftCountsPerDay[i]["Afternoon"] < 2) {
          shift = "Afternoon";
        }

        result[worker][i] = shift;
        if (shift !== "Off") shiftCountsPerDay[i][shift]++;
      }
    }

    setSchedule((prev) => ({ ...prev, [selectedWeekIndex]: result }));
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
          onGenerate={generateSchedule}
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
