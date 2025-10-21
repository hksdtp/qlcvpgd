import { Menu, Search, Mic, PenSquare } from "lucide-react";

export default function BottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-2xl border-t border-gray-200/50 px-4 py-2 safe-area-bottom">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Menu Button */}
        <button className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-xl flex items-center justify-center active:scale-95 transition-transform shadow-sm">
          <Menu className="w-5 h-5 text-[#007AFF]" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 mx-3 h-9 bg-white/60 backdrop-blur-xl rounded-full flex items-center px-4 gap-2 shadow-sm">
          <Search className="w-4 h-4 text-gray-500" />
          <span className="text-[15px] text-gray-500">Tìm kiếm</span>
          <Mic className="w-4 h-4 text-gray-500 ml-auto" />
        </div>

        {/* Compose Button */}
        <button className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-xl flex items-center justify-center active:scale-95 transition-transform shadow-sm">
          <PenSquare className="w-5 h-5 text-[#007AFF]" />
        </button>
      </div>
    </div>
  );
}
