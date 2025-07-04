import { useState, useEffect } from "react";
import WeekSelector from "./WeekSelector";
import ShiftPreferencesForm from "./ShiftPreferencesForm";
import ScheduleTable from "./ScheduleTable";
import ActionButtons from "./ActionButtons";
import ShiftRequestModal from "./Modals/ShiftRequestModal";
import AdminConfirmModal from "./Modals/AdminConfirmModal"; // <-- Import the modal here
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
  const [preferences, setPreferences] = useState<{ [name: string]: string }>({});
  const [schedule, setSchedule] = useState<{ [weekIndex: number]: any }>({});
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [requestModalData, setRequestModalData] = useState<any | null>(null);
  const [adminConfirmData, setAdminConfirmData] = useState<{
    worker: string;
    date: string;
    dayIndex: number;
    currentShift: string;
    newShift: string;
  } | null>(null);
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

  const currentWeekDates =
    weekMondays.length === 4 ? generateWeekDates(weekMondays[selectedWeekIndex]) : [];

  const isAdmin = false; // Simulating admin for now

  const handleRequestShift = (worker: string, date: string, currentShift: string) => {
    setRequestModalData({ worker, date, currentShift, weekIndex: selectedWeekIndex });
  };

  const handleShiftChange = (worker: string, dayIndex: number, shift: string) => {
    if (isAdmin) {
      setAdminConfirmData({
        worker,
        date: currentWeekDates[dayIndex],
        dayIndex,
        currentShift: schedule[selectedWeekIndex]?.[worker]?.[dayIndex] || "Off",
        newShift: shift,
      });
    } else {
      setSchedule((prev) => {
        const weekSchedule = { ...(prev[selectedWeekIndex] || {}) };
        const workerShifts = [...(weekSchedule[worker] || Array(7).fill("Off"))];
        workerShifts[dayIndex] = shift;
        weekSchedule[worker] = workerShifts;
        return { ...prev, [selectedWeekIndex]: weekSchedule };
      });
      setEditingDay(null);
    }
  };

  const confirmAdminShiftChange = () => {
    if (!adminConfirmData) return;
    const { worker, dayIndex, newShift } = adminConfirmData;
    setSchedule((prev) => {
      const weekSchedule = { ...(prev[selectedWeekIndex] || {}) };
      const workerShifts = [...(weekSchedule[worker] || Array(7).fill("Off"))];
      workerShifts[dayIndex] = newShift;
      weekSchedule[worker] = workerShifts;
      return { ...prev, [selectedWeekIndex]: weekSchedule };
    });
    setAdminConfirmData(null);
    setEditingDay(null);
  };

  const cancelAdminShiftChange = () => {
    setAdminConfirmData(null);
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
            onEdit={(worker, dayIndex) =>
              isAdmin
                ? setEditingDay(`${selectedWeekIndex}-${worker}-${dayIndex}`)
                : handleRequestShift(worker, currentWeekDates[dayIndex], schedule[selectedWeekIndex]?.[worker]?.[dayIndex] || "Off")
            }
            onShiftChange={handleShiftChange}
            dayLabels={currentWeekDates}
            dayDates={
              weekMondays.length === 4 ? generateWeekISODates(weekMondays[selectedWeekIndex]) : []
            }
            selectedWeekIndex={selectedWeekIndex}
            isAdmin={isAdmin}
            onRequestShift={handleRequestShift}
          />

          <ActionButtons onRegenerate={regenerate} onSave={saveSchedule} />
        </>
      )}

      {requestModalData && (
        <ShiftRequestModal
          {...requestModalData}
          onClose={() => setRequestModalData(null)}
          onSubmit={handleRequestSubmit}
        />
      )}

      {adminConfirmData && (
        <AdminConfirmModal
          worker={adminConfirmData.worker}
          date={adminConfirmData.date}
          newShift={adminConfirmData.newShift}
          onConfirm={confirmAdminShiftChange}
          onCancel={cancelAdminShiftChange}
        />
      )}
    </div>
  );
}

export default MonthlyBubble;
