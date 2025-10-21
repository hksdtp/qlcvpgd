import { User, ShoppingCart, MessageSquare, Megaphone, Users } from "lucide-react";

export default function MailFilters() {
  const filters = [
    { icon: User, label: "", active: false },
    { icon: ShoppingCart, label: "Giao dịch", active: true },
    { icon: MessageSquare, label: "", active: false },
    { icon: Megaphone, label: "", active: false },
    { icon: Users, label: "", active: false },
  ];

  return (
    <div className="px-4 mb-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {filters.map((filter, index) => (
          <button
            key={index}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all active:scale-95 ${
              filter.active
                ? "bg-[#34C759] text-white shadow-lg shadow-green-500/30"
                : "bg-white/40 backdrop-blur-xl text-gray-700"
            }`}
          >
            <filter.icon className="w-4 h-4" />
            {filter.label && <span className="text-[15px]">{filter.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
