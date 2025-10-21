interface DeleteModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({ onCancel, onConfirm }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      ></div>

      {/* Modal */}
      <div className="relative bg-white/90 backdrop-blur-2xl rounded-[20px] w-full max-w-sm overflow-hidden shadow-2xl border border-white/50">
        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-[17px] text-black mb-2">Xoá công việc</h3>
          <p className="text-[13px] text-gray-600">
            Bạn có chắc chắn muốn xoá công việc này? Hành động này không thể hoàn tác.
          </p>
        </div>

        {/* Buttons */}
        <div className="border-t border-gray-200/50">
          <div className="grid grid-cols-2">
            <button
              onClick={onCancel}
              className="px-4 py-3 text-[17px] text-[#007AFF] active:bg-gray-100/50 transition-colors border-r border-gray-200/50"
            >
              Huỷ
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-3 text-[17px] text-red-600 active:bg-gray-100/50 transition-colors"
            >
              Xoá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
