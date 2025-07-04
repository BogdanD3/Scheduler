type Schedule = {
  [worker: string]: string[];
};

interface GenerateScheduleParams {
  workers: string[];
  preferences: { [name: string]: string };
  selectedWeekIndex: number;
  setSchedule: React.Dispatch<React.SetStateAction<{ [weekIndex: number]: any }>>;
}

export function generateSchedule({
  workers,
  preferences,
  selectedWeekIndex,
  setSchedule,
}: GenerateScheduleParams) {
  const result: Schedule = {};
  const offDaysSet = new Set<number>();
  const eve = "Eve";
  const otherWorkers = workers.filter((w) => w !== eve);

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

  const preferredNightWorkers = otherWorkers.filter(
    (w) => preferences[w] === "Night"
  );
  const nightFillIn =
    preferredNightWorkers.length > 0
      ? preferredNightWorkers[0]
      : otherWorkers[Math.floor(Math.random() * otherWorkers.length)];

  const dayWorkers = otherWorkers.filter((w) => w !== nightFillIn);
  result[nightFillIn] = Array(7).fill(null);

  for (const day of eveOffDays) {
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

    let shift = "Off";
    if (shiftCountsPerDay[i]["Morning"] < 2) {
      shift = "Morning";
    } else if (shiftCountsPerDay[i]["Afternoon"] < 2) {
      shift = "Afternoon";
    }

    result[nightFillIn][i] = shift;
    if (shift !== "Off") shiftCountsPerDay[i][shift]++;
  }

  for (const worker of dayWorkers) {
    result[worker] = Array(7).fill(null);

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

    const preferred = preferences?.[worker] ?? ["Morning", "Afternoon", "Night"][Math.floor(Math.random() * 3)];

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
}
