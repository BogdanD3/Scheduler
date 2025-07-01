import clsx from "clsx";

interface Props {
  weeks: string[];
  selectedWeekIndex: number;
  onWeekChange: (index: number) => void;
}

function WeekSelector({ weeks, selectedWeekIndex, onWeekChange }: Props) {
  return (
    <div className="mb-4 flex gap-4">
      {weeks.map((w, i) => (
        <button
          key={w}
          className={clsx(
            "px-4 py-2 rounded",
            selectedWeekIndex === i ? "bg-blue-600" : "bg-white/10"
          )}
          onClick={() => onWeekChange(i)}
        >
          {w}
        </button>
      ))}
    </div>
  );
}

export default WeekSelector;
