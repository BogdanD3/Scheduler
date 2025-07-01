import { useState } from "react";
import clsx from "clsx";
import WeekSelector from "./WeekSelector";
import ShiftPreferencesForm from "./ShiftPreferencesForm";
import ScheduleTable from "./ScheduleTable";
import ActionButtons from "./ActionButtons";

const workers = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

function MonthlyBubble() {
  const [preferences, setPreferences] = useState<{ [name: string]: string }>({});
  const [schedule, setSchedule] = useState<any>(null);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  const regenerate = () => {
    setSchedule(null);
    setPreferences({});
  };

  const saveSchedule = () => {
    alert("Schedule saved! (Functionality to be implemented)");
  };

  const handlePreferenceChange = (worker: string, shift: string) => {
    setPreferences((prev) => ({ ...prev, [worker]: shift }));
  };

  const generateSchedule = () => {
    const result: any = {};
    const offDaysSet = new Set<number>();
    const eve = "Eve";
    const otherWorkers = workers.filter(w => w !== eve);

    const eveOffStart = Math.floor(Math.random() * 6);
    const eveOffDays = [eveOffStart, eveOffStart + 1];

    result[eve] = Array(7)
      .fill("Night")
      .map((_, i) => (eveOffDays.includes(i) ? "Off" : "Night"));

    const shiftCountsPerDay: Record<number, Record<string, number>> = {};
    for (let i = 0; i < 7; i++) {
      shiftCountsPerDay[i] = { Morning: 0, Afternoon: 0, Night: 0 };
      if (!eveOffDays.includes(i)) shiftCountsPerDay[i]["Night"]++;
    }

    const nightFillIn = otherWorkers[Math.floor(Math.random() * otherWorkers.length)];
    const dayWorkers = otherWorkers.filter(w => w !== nightFillIn);
    result[nightFillIn] = Array(7).fill(null);

    for (let day of eveOffDays) {
      result[nightFillIn][day] = "Night";
      shiftCountsPerDay[day]["Night"]++;
    }

    const fillInOffDay1 = (eveOffDays[1] + 1) % 7;
    const fillInOffDay2 = (fillInOffDay1 + 1) % 7;

    result[nightFillIn][fillInOffDay1] = "Off";
    result[nightFillIn][fillInOffDay2] = "Off";
    shiftCountsPerDay[fillInOffDay1] ??= { Morning: 0, Afternoon: 0, Night: 0 };
    shiftCountsPerDay[fillInOffDay2] ??= { Morning: 0, Afternoon: 0, Night: 0 };

    for (let i = 0; i < 7; i++) {
      if (result[nightFillIn][i]) continue;

      const shift = shiftCountsPerDay[i]["Morning"] < 2 ? "Morning" :
                    shiftCountsPerDay[i]["Afternoon"] < 2 ? "Afternoon" : "Off";

      result[nightFillIn][i] = shift;
      if (shift !== "Off") shiftCountsPerDay[i][shift]++;
    }

    for (const worker of dayWorkers) {
      result[worker] = Array(7).fill(null);
      let freeDay = -1;
      for (let tries = 0; tries < 20; tries++) {
        const d = Math.floor(Math.random() * 7);
        if (!offDaysSet.has(d) && !eveOffDays.includes(d) && result[nightFillIn][d] !== "Off") {
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

      for (let i = 0; i < 7; i++) {
        if (i === freeDay) {
          result[worker][i] = "Off";
          continue;
        }

        const shift = shiftCountsPerDay[i]["Morning"] < 2 ? "Morning" :
                      shiftCountsPerDay[i]["Afternoon"] < 2 ? "Afternoon" : "Off";

        result[worker][i] = shift;
        if (shift !== "Off") shiftCountsPerDay[i][shift]++;
      }
    }

    setSchedule(result);
  };

  return (
    <div className="text-white p-4">
      <h2 className="text-2xl mb-4">📅 Monthly Schedule (4 weeks)</h2>

      <WeekSelector
        weeks={weeks}
        selectedWeekIndex={selectedWeekIndex}
        onWeekChange={(i) => {
          setSelectedWeekIndex(i);
          regenerate();
        }}
      />

      {!schedule ? (
        <ShiftPreferencesForm
          workers={workers.slice(0, 4)}
          preferences={preferences}
          onChange={handlePreferenceChange}
          onGenerate={generateSchedule}
        />
      ) : (
        <>
          <ScheduleTable schedule={schedule} workers={workers} />
          <ActionButtons onRegenerate={regenerate} onSave={saveSchedule} />
        </>
      )}
    </div>
  );
}

export default MonthlyBubble;
