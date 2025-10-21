import { ChevronLeft, Plus, Circle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface ChecklistScreenProps {
  onBack: () => void;
}

interface ChecklistItem {
  id: number;
  title: string;
  completed: boolean;
}

export default function ChecklistScreen({ onBack }: ChecklistScreenProps) {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: 1, title: "Nghiên cứu design system", completed: true },
    { id: 2, title: "Tạo wireframe", completed: true },
    { id: 3, title: "Design mockup", completed: true },
    { id: 4, title: "Review với team", completed: false },
    { id: 5, title: "Hoàn thiện và bàn giao", completed: false },
  ]);
  const [newItem, setNewItem] = useState("");

  const toggleItem = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, {
        id: Date.now(),
        title: newItem,
        completed: false
      }]);
      setNewItem("");
    }
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progress = (completedCount / totalCount) * 100;

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
            <div className="text-[17px] text-black">Danh sách công việc</div>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Progress */}
        <div className="p-4">
          <div className="bg-white/30 backdrop-blur-xl rounded-[20px] p-4 shadow-xl shadow-black/5 border border-white/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[15px] text-black">Tiến độ</span>
              <span className="text-[15px] text-gray-600">{completedCount}/{totalCount}</span>
            </div>
            <div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Checklist Items */}
        <div className="flex-1 px-4 pb-4">
          <div className="bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40">
            {items.map((item, index) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-center gap-3 px-4 py-3 active:bg-white/20 transition-colors cursor-pointer ${
                  index !== items.length - 1 ? 'border-b border-gray-200/50' : ''
                }`}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-[#007AFF] flex-shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
                <span className={`flex-1 text-[15px] ${
                  item.completed ? 'text-gray-400 line-through' : 'text-black'
                }`}>
                  {item.title}
                </span>
              </div>
            ))}

            {/* Add New Item */}
            <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200/50">
              <Plus className="w-6 h-6 text-[#007AFF] flex-shrink-0" />
              <input
                type="text"
                placeholder="Thêm công việc mới..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                className="flex-1 bg-transparent text-[15px] text-black placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
