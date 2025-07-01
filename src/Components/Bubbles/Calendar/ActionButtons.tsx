interface Props {
  onRegenerate: () => void;
  onSave: () => void;
}

function ActionButtons({ onRegenerate, onSave }: Props) {
  return (
    <div className="mt-6 flex gap-4">
      <button
        onClick={onRegenerate}
        className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
      >
        🔄 Regenerate
      </button>
      <button
        onClick={onSave}
        className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
      >
        ✅ Save
      </button>
    </div>
  );
}

export default ActionButtons;
