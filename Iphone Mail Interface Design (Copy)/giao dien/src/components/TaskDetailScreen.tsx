import { ChevronLeft, MoreHorizontal, Calendar, Users, Tag, Flag, CheckSquare, MessageCircle, Trash2 } from "lucide-react";
import { useState } from "react";

interface TaskDetailScreenProps {
  onBack: () => void;
  onDelete: () => void;
  onOpenChecklist: () => void;
  onOpenComments: () => void;
}

export default function TaskDetailScreen({ onBack, onDelete, onOpenChecklist, onOpenComments }: TaskDetailScreenProps) {
  const [showMenu, setShowMenu] = useState(false);

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
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center active:bg-gray-200/50 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-[#007AFF]" />
            </button>
            <div className="text-[17px] text-black">Chi tiết</div>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 flex items-center justify-center active:bg-gray-200/50 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-[#007AFF]" />
            </button>
          </div>
        </div>

        {/* Task Content */}
        <div className="flex-1 p-4 space-y-4">
          {/* Title & Description */}
          <div className="bg-white/30 backdrop-blur-xl rounded-[20px] p-4 shadow-xl shadow-black/5 border border-white/40">
            <h2 className="text-[20px] text-black mb-2">Thiết kế giao diện ứng dụng</h2>
            <p className="text-[15px] text-gray-600">
              Hoàn thành thiết kế UI/UX cho ứng dụng quản lý công việc với phong cách liquid glass effect
            </p>
          </div>

          {/* Info Cards */}
          <div className="bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40">
            {/* Due Date */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200/50">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#007AFF]" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] text-gray-500">Ngày hết hạn</div>
                <div className="text-[15px] text-black">25/10/2025</div>
              </div>
            </div>

            {/* Assignees */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200/50">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] text-gray-500">Người thực hiện</div>
                <div className="flex -space-x-2 mt-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[12px] border-2 border-white">NA</div>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-[12px] border-2 border-white">TB</div>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-[12px] border-2 border-white">LC</div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200/50">
              <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center">
                <Tag className="w-4 h-4 text-pink-600" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] text-gray-500">Nhãn</div>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-700 text-[12px] rounded-full">Design</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-700 text-[12px] rounded-full">UI/UX</span>
                </div>
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Flag className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] text-gray-500">Độ ưu tiên</div>
                <div className="text-[15px] text-orange-600">Cao</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40">
            <button
              onClick={onOpenChecklist}
              className="w-full flex items-center gap-3 px-4 py-3 active:bg-white/20 transition-colors border-b border-gray-200/50"
            >
              <CheckSquare className="w-5 h-5 text-[#007AFF]" />
              <span className="flex-1 text-left text-[15px] text-black">Danh sách công việc</span>
              <span className="text-[15px] text-gray-500">3/5</span>
            </button>

            <button
              onClick={onOpenComments}
              className="w-full flex items-center gap-3 px-4 py-3 active:bg-white/20 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-[#007AFF]" />
              <span className="flex-1 text-left text-[15px] text-black">Bình luận</span>
              <span className="text-[15px] text-gray-500">12</span>
            </button>
          </div>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="w-full bg-red-500/20 backdrop-blur-xl rounded-[20px] px-4 py-3 flex items-center justify-center gap-2 active:bg-red-500/30 transition-colors shadow-xl shadow-black/5 border border-red-300/40"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
            <span className="text-[15px] text-red-600">Xoá công việc</span>
          </button>
        </div>
      </div>
    </div>
  );
}
