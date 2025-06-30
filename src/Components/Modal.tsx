type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xl flex justify-center items-center p-8">
      <div className="bg-white/10 rounded-3xl p-6 w-[90%] h-[90%] text-white shadow-2xl overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-sm px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
        >
          ✕ Close
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;