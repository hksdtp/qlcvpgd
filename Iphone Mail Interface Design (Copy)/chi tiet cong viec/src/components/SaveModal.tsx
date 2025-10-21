interface SaveModalProps {
  onCancel: () => void;
  onSave: () => void;
  onDiscard: () => void;
}

export default function SaveModal({ onCancel, onSave, onDiscard }: SaveModalProps) {
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
          <h3 className="text-[17px] text-black mb-2">Lưu thay đổi</h3>
          <p className="text-[13px] text-gray-600">
            Bạn có muốn lưu các thay đổi đã thực hiện?
          </p>
        </div>

        {/* Buttons */}
        <div className="border-t border-gray-200/50">
          <button
            onClick={onSave}
            className="w-full px-4 py-3 text-[17px] text-[#007AFF] active:bg-gray-100/50 transition-colors border-b border-gray-200/50"
          >
            Lưu
          </button>
          <button
            onClick={onDiscard}
            className="w-full px-4 py-3 text-[17px] text-red-600 active:bg-gray-100/50 transition-colors border-b border-gray-200/50"
          >
            Không lưu
          </button>
          <button
            onClick={onCancel}
            className="w-full px-4 py-3 text-[17px] text-gray-600 active:bg-gray-100/50 transition-colors"
          >
            Huỷ
          </button>
        </div>
      </div>
    </div>
  );
}
