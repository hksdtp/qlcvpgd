import { X, Calendar, Users, Tag, Flag } from "lucide-react";
import { useState } from "react";

interface NewTaskScreenProps {
  onClose: () => void;
  onSave: (task: any) => void;
}

export default function NewTaskScreen({ onClose, onSave }: NewTaskScreenProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  const canSave = title.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-md mx-auto relative overflow-hidden">
      {/* Liquid Glass Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-100/30 to-purple-100/30 backdrop-blur-3xl"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-2xl border-b border-gray-200/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center active:bg-gray-200/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#007AFF]" />
            </button>
            <div className="text-[17px] text-black">Công việc mới</div>
            <button
              onClick={() => canSave && onSave({ title, description, priority })}
              disabled={!canSave}
              className={`text-[17px] ${canSave ? 'text-[#007AFF]' : 'text-gray-400'}`}
            >
              Lưu
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-4 space-y-4">
          {/* Title Input */}
          <div className="bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40">
            <input
              type="text"
              placeholder="Tiêu đề công việc"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-4 bg-transparent text-[17px] text-black placeholder:text-gray-400 outline-none"
            />
          </div>

          {/* Description Input */}
          <div className="bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40">
            <textarea
              placeholder="Mô tả chi tiết..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-4 bg-transparent text-[15px] text-black placeholder:text-gray-400 outline-none resize-none"
            />
          </div>

          {/* Options */}
          <div className="bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40">
            {/* Due Date */}
            <button className="w-full flex items-center gap-3 px-4 py-3 active:bg-white/20 transition-colors border-b border-gray-200/50">
              <Calendar className="w-5 h-5 text-[#007AFF]" />
              <span className="flex-1 text-left text-[15px] text-black">Ngày hết hạn</span>
              <span className="text-[15px] text-gray-500">Chưa đặt</span>
            </button>

            {/* Assignees */}
            <button className="w-full flex items-center gap-3 px-4 py-3 active:bg-white/20 transition-colors border-b border-gray-200/50">
              <Users className="w-5 h-5 text-[#007AFF]" />
              <span className="flex-1 text-left text-[15px] text-black">Người thực hiện</span>
              <span className="text-[15px] text-gray-500">Chọn</span>
            </button>

            {/* Tags */}
            <button className="w-full flex items-center gap-3 px-4 py-3 active:bg-white/20 transition-colors border-b border-gray-200/50">
              <Tag className="w-5 h-5 text-[#007AFF]" />
              <span className="flex-1 text-left text-[15px] text-black">Nhãn</span>
              <span className="text-[15px] text-gray-500">Thêm</span>
            </button>

            {/* Priority */}
            <button className="w-full flex items-center gap-3 px-4 py-3 active:bg-white/20 transition-colors">
              <Flag className="w-5 h-5 text-[#007AFF]" />
              <span className="flex-1 text-left text-[15px] text-black">Độ ưu tiên</span>
              <span className="text-[15px] text-gray-500 capitalize">{priority === 'high' ? 'Cao' : priority === 'medium' ? 'Trung bình' : 'Thấp'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
