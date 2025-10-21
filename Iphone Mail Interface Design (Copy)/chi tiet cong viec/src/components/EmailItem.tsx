import { ChevronRight, Clock } from "lucide-react";

interface EmailItemProps {
  sender: string;
  subject?: string;
  preview?: string;
  preview2?: string;
  time?: string;
  icon: React.ReactNode;
  unread?: boolean;
  iconColor: string;
  badge?: React.ReactNode;
}

export default function EmailItem({
  sender,
  subject,
  preview,
  preview2,
  time,
  icon,
  unread = false,
  iconColor,
  badge,
}: EmailItemProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 active:bg-white/20 transition-colors border-b border-gray-200/50 last:border-b-0">
      {/* Unread indicator */}
      {unread && (
        <div className="w-2 h-2 rounded-full bg-[#007AFF] flex-shrink-0 mt-2"></div>
      )}
      
      {!unread && (
        <div className="w-2 h-2 flex-shrink-0 mt-2"></div>
      )}

      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center flex-shrink-0 shadow-sm`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[15px] text-black">
            {sender}
          </span>
          {time && (
            <div className="flex items-center gap-1">
              <span className="text-[13px] text-gray-500">{time}</span>
              <Clock className="w-3.5 h-3.5 text-gray-400" />
            </div>
          )}
        </div>
        
        {subject && (
          <div className="text-[14px] text-gray-600 mb-0.5">
            • {subject}
          </div>
        )}
        
        {preview && (
          <div className="text-[14px] text-gray-600">
            • {preview}
          </div>
        )}
        
        {preview2 && (
          <div className="text-[14px] text-gray-600">
            • {preview2}
          </div>
        )}
      </div>

      {/* Badge */}
      {badge && <div className="flex-shrink-0 mt-1">{badge}</div>}
    </div>
  );
}
