export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  isDestructive = false
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#072d4a]/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="p-6">
          <h3 className="text-lg font-bold text-[#072d4a]">{title}</h3>
          <p className="mt-2 text-sm text-[#53698d]">{message}</p>
        </div>
        <div className="flex justify-end gap-3 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            type="button"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${
              isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-[#056ba6] hover:bg-[#045585]"
            }`}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
