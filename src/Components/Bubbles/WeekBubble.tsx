import { useEffect, useState } from "react";
import ScheduleTable from "./Calendar/ScheduleTable";
import ShiftRequestModal from "./Calendar/ShiftRequestModal";
import AdminConfirmModal from "./Calendar/AdminConfirmModal";
import RequestsList from "../RequestsList";


const workers = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

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

function generateWeekISOdates(startMonday: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startMonday);
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

interface ShiftRequest {
  worker: string;
  date: string;
  currentShift: string;
  desiredShift: string;
  reason: string;
}

function WeekBubble() {
  const [schedule, setSchedule] = useState<{ [worker: string]: string[] }>({});
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [requests, setRequests] = useState<ShiftRequest[]>([]);
  const [requestModalData, setRequestModalData] = useState<
    Omit<ShiftRequest, "desiredShift" | "reason"> | null
  >(null);
  const [pendingChange, setPendingChange] = useState<{
    worker: string;
    dayIndex: number;
    newShift: string;
  } | null>(null);



  const isAdmin = true; // toggle to true for admin testing
  const selectedWeekIndex = 0;

  const monday = getMonday(new Date());
  const weekDates = generateWeekDates(monday);
  const weekISOdates = generateWeekISOdates(monday);

useEffect(() => {
  // Simulate backend fetch delay
  setTimeout(() => {
    const fetchedSchedule = {
      Alice: ["Morning", "Morning", "Off", "Afternoon", "Night", "Off", "Off"],
      Bob: ["Off", "Afternoon", "Afternoon", "Off", "Off", "Morning", "Morning"],
      Charlie: ["Morning", "Off", "Morning", "Morning", "Off", "Afternoon", "Off"],
      Diana: ["Afternoon", "Off", "Off", "Afternoon", "Afternoon", "Off", "Off"],
      Eve: ["Night", "Night", "Night", "Night", "Night", "Off", "Off"],
    };

    const fetchedRequests = [
      {
        worker: "Bob",
        date: "02.07",
        currentShift: "Afternoon",
        desiredShift: "Morning",
        reason: "Family event",
      },
    ];

    setSchedule(fetchedSchedule);
    setRequests(fetchedRequests);
  }, 1000);
}, []);

  const handleEdit = (worker: string, dayIndex: number) => {
    const key = `${selectedWeekIndex}-${worker}-${dayIndex}`;
    setEditingDay(key);
  };

  const handleShiftChange = (worker: string, dayIndex: number, shift: string) => {
  if (isAdmin) {
    setPendingChange({ worker, dayIndex, newShift: shift });
  } else {
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const shifts = [...(newSchedule[worker] || Array(7).fill("Off"))];
      shifts[dayIndex] = shift;
      newSchedule[worker] = shifts;
      return newSchedule;
    });
    setEditingDay(null);
  }
};


  const handleRequestSubmit = (request: ShiftRequest) => {
    setRequests((prev) => [...prev, request]);
    setRequestModalData(null);
  };

  const confirmAdminEdit = () => {
  if (!pendingChange) return;
  const { worker, dayIndex, newShift } = pendingChange;

  setSchedule((prev) => {
    const newSchedule = { ...prev };
    const shifts = [...(newSchedule[worker] || Array(7).fill("Off"))];
    shifts[dayIndex] = newShift;
    newSchedule[worker] = shifts;
    return newSchedule;
  });

  setEditingDay(null);
  setPendingChange(null);
};



  return (
    <div className="text-white p-4">
      <h2 className="text-xl mb-4">📆 This Week's Schedule</h2>

      {Object.keys(schedule).length > 0 ? (
        <>
          <ScheduleTable
            schedule={schedule}
            workers={workers}
            editingDay={editingDay}
            onEdit={handleEdit}
            onShiftChange={handleShiftChange}
            dayLabels={weekDates}
            dayDates={weekISOdates}
            selectedWeekIndex={selectedWeekIndex}
            isAdmin={isAdmin}
            onRequestShift={(worker, date, currentShift) => {
              setRequestModalData({ worker, date, currentShift });
            }}
          />

          {isAdmin && requests.length > 0 && (
            <RequestsList
              requests={requests}
              onApprove={(request) => {
                handleShiftChange(request.worker, weekISOdates.indexOf(request.date), request.desiredShift);
                setRequests((prev) => prev.filter((r) => r !== request));
              }}
              onReject={(request) => {
                setRequests((prev) => prev.filter((r) => r !== request));
              }}
            />
          )}
        </>
      ) : (
        <p>Loading schedule...</p>
      )}

      {requestModalData && (
        <ShiftRequestModal
          {...requestModalData}
          onClose={() => setRequestModalData(null)}
          onSubmit={handleRequestSubmit}
        />
      )}
      {pendingChange && (
        <AdminConfirmModal
          worker={pendingChange.worker}
          date={weekDates[pendingChange.dayIndex]}
          newShift={pendingChange.newShift}
          onConfirm={confirmAdminEdit}
          onCancel={() => setPendingChange(null)}
        />
      )}

    </div>
  );
}

export default WeekBubble;
