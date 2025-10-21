import { Check } from "lucide-react";

interface UserItemProps {
  name: string;
  email: string;
  avatar?: string;
  selected?: boolean;
  avatarColor: string;
  initials: string;
}

export default function UserItem({
  name,
  email,
  avatar,
  selected = false,
  avatarColor,
  initials,
}: UserItemProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 active:bg-white/20 transition-colors border-b border-gray-200/50 last:border-b-0 cursor-pointer">
      {/* Avatar */}
      <div
        className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0 shadow-sm`}
      >
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className="text-white text-[17px]">{initials}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-[15px] text-black mb-0.5">
          {name}
        </div>
        <div className="text-[13px] text-gray-500 truncate">
          {email}
        </div>
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      )}
    </div>
  );
}
