import StatusBar from "./components/StatusBar";
import MailHeader from "./components/MailHeader";
import MailFilters from "./components/MailFilters";
import EmailItem from "./components/EmailItem";
import BottomBar from "./components/BottomBar";
import { Star, Building2, Store } from "lucide-react";

export default function App() {
  const newEmails = [
    {
      id: 1,
      sender: "Warp",
      preview: "Your Warp subscription will renew soon",
      preview2: "Your Warp subscription will renew o...",
      time: "14:33",
      icon: <Building2 className="w-5 h-5 text-white" />,
      iconColor: "bg-gradient-to-br from-blue-400 to-blue-500",
      unread: true,
      badge: null,
    },
    {
      id: 2,
      sender: "AR@cloudinary.com",
      preview: "ACTION REQUIRED: Cloudinary Payment...",
      preview2: "SECOND NOTICE: Cloudinary Payment Fa...",
      time: "Hôm qua",
      icon: <Star className="w-5 h-5 text-white" />,
      iconColor: "bg-gradient-to-br from-pink-400 to-pink-600",
      unread: true,
      badge: null,
    },
    {
      id: 3,
      sender: "Supabase",
      preview: "Your Supabase invoice is overdue - final r...",
      preview2: "Your Supabase invoice is overdue",
      time: "Hôm qua",
      icon: <Store className="w-5 h-5 text-white" />,
      iconColor: "bg-gradient-to-br from-purple-400 to-purple-600",
      unread: true,
      badge: null,
    },
    {
      id: 4,
      sender: "Vercel",
      preview: "New billing model for v0: From message t...",
      preview2: "Your receipt from Vercel Inc. #2093-4773",
      time: "Thứ Năm",
      icon: <Building2 className="w-5 h-5 text-white" />,
      iconColor: "bg-gradient-to-br from-blue-300 to-blue-400",
      unread: true,
      badge: null,
    },
  ];

  const oldEmails = [
    {
      id: 5,
      sender: "Apple",
      preview: "Biên nhận của bạn từ Apple",
      preview2: "Đã xác nhận đăng ký của bạn",
      time: "Thứ Năm",
      icon: <Building2 className="w-5 h-5 text-white" />,
      iconColor: "bg-gradient-to-br from-gray-400 to-gray-500",
      unread: true,
      badge: null,
    },
    {
      id: 6,
      sender: "MoMo",
      preview: "Giao dịch thành công",
      preview2: "Giao dịch thành công",
      time: "Thứ Năm",
      icon: <Building2 className="w-5 h-5 text-white" />,
      iconColor: "bg-gradient-to-br from-pink-500 to-pink-600",
      unread: true,
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-md mx-auto relative overflow-hidden">
      {/* Liquid Glass Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-100/30 to-purple-100/30 backdrop-blur-3xl"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200/10 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Status Bar */}
        <StatusBar />

        {/* Mail Header */}
        <MailHeader />

        {/* Filters */}
        <MailFilters />

        {/* Email List */}
        <div className="pb-24">
          {/* New Emails Section */}
          <div className="px-4 mb-2">
            <h3 className="text-[13px] text-gray-500">Thư mới</h3>
          </div>
          <div className="bg-white/30 backdrop-blur-xl rounded-[20px] mx-4 overflow-hidden shadow-xl shadow-black/5 border border-white/40 mb-6">
            {newEmails.map((email) => (
              <EmailItem
                key={email.id}
                sender={email.sender}
                preview={email.preview}
                preview2={email.preview2}
                time={email.time}
                icon={email.icon}
                iconColor={email.iconColor}
                unread={email.unread}
                badge={email.badge}
              />
            ))}
          </div>

          {/* Old Emails Section */}
          <div className="px-4 mb-2">
            <h3 className="text-[13px] text-gray-500">Thư cũ hơn</h3>
          </div>
          <div className="bg-white/30 backdrop-blur-xl rounded-[20px] mx-4 overflow-hidden shadow-xl shadow-black/5 border border-white/40">
            {oldEmails.map((email) => (
              <EmailItem
                key={email.id}
                sender={email.sender}
                preview={email.preview}
                preview2={email.preview2}
                time={email.time}
                icon={email.icon}
                iconColor={email.iconColor}
                unread={email.unread}
                badge={email.badge}
              />
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <BottomBar />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .safe-area-bottom {
          padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </div>
  );
}
