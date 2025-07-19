// src/components/LoadingOverlay.tsx
export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
      <div className="w-12 h-12 border-4 border-t-transparent border-green-600 rounded-full animate-spin" />
    </div>
  );
}
