// Color system for filters - Each category has unique colors

export const DEPARTMENT_COLORS = {
  'Kinh Doanh': {
    bg: 'bg-blue-500',
    bgActive: 'bg-blue-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-blue-500/30',
    border: 'border-blue-200',
    gradient: 'from-blue-400 to-blue-600',
  },
  'Sản xuất/ Kỹ Thuật': {
    bg: 'bg-purple-500',
    bgActive: 'bg-purple-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-purple-500/30',
    border: 'border-purple-200',
    gradient: 'from-purple-400 to-purple-600',
  },
  'Hành Chính Nhân Sự': {
    bg: 'bg-pink-500',
    bgActive: 'bg-pink-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-pink-500/30',
    border: 'border-pink-200',
    gradient: 'from-pink-400 to-pink-600',
  },
  'Marketing': {
    bg: 'bg-orange-500',
    bgActive: 'bg-orange-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-orange-500/30',
    border: 'border-orange-200',
    gradient: 'from-orange-400 to-orange-600',
  },
  'CV Chung': {
    bg: 'bg-gray-500',
    bgActive: 'bg-gray-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-gray-500/30',
    border: 'border-gray-200',
    gradient: 'from-gray-400 to-gray-600',
  },
  'CV Khác': {
    bg: 'bg-teal-500',
    bgActive: 'bg-teal-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-teal-500/30',
    border: 'border-teal-200',
    gradient: 'from-teal-400 to-teal-600',
  },
};

export const STATUS_COLORS = {
  'Chưa làm': {
    bg: 'bg-red-500',
    bgActive: 'bg-red-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-red-500/30',
    border: 'border-red-200',
    gradient: 'from-red-400 to-red-600',
  },
  'Lên Kế Hoạch': {
    bg: 'bg-indigo-500',
    bgActive: 'bg-indigo-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-indigo-500/30',
    border: 'border-indigo-200',
    gradient: 'from-indigo-400 to-indigo-600',
  },
  'Cần làm': {
    bg: 'bg-cyan-500',
    bgActive: 'bg-cyan-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-cyan-500/30',
    border: 'border-cyan-200',
    gradient: 'from-cyan-400 to-cyan-600',
  },
  'Đang làm': {
    bg: 'bg-yellow-500',
    bgActive: 'bg-yellow-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-yellow-500/30',
    border: 'border-yellow-200',
    gradient: 'from-yellow-400 to-yellow-600',
  },
  'Hoàn thành': {
    bg: 'bg-green-500',
    bgActive: 'bg-green-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-green-500/30',
    border: 'border-green-200',
    gradient: 'from-green-400 to-green-600',
  },
  'Tồn đọng': {
    bg: 'bg-rose-600',
    bgActive: 'bg-rose-600',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-rose-600/30',
    border: 'border-rose-200',
    gradient: 'from-rose-500 to-rose-700',
  },
  'Dừng': {
    bg: 'bg-slate-500',
    bgActive: 'bg-slate-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-slate-500/30',
    border: 'border-slate-200',
    gradient: 'from-slate-400 to-slate-600',
  },
};

export const PRIORITY_COLORS = {
  'CAO': {
    bg: 'bg-rose-500',
    bgActive: 'bg-rose-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-rose-500/30',
    border: 'border-rose-200',
    gradient: 'from-rose-400 to-rose-600',
  },
  'TRUNG BÌNH': {
    bg: 'bg-amber-500',
    bgActive: 'bg-amber-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-amber-500/30',
    border: 'border-amber-200',
    gradient: 'from-amber-400 to-amber-600',
  },
  'THẤP': {
    bg: 'bg-sky-500',
    bgActive: 'bg-sky-500',
    bgInactive: 'bg-gray-100',
    text: 'text-gray-500',
    textActive: 'text-white',
    shadow: 'shadow-sky-500/30',
    border: 'border-sky-200',
    gradient: 'from-sky-400 to-sky-600',
  },
};

// Default color for "All" option
export const DEFAULT_COLOR = {
  bg: 'bg-[#34C759]',
  bgActive: 'bg-[#34C759]',
  bgInactive: 'bg-white/40',
  text: 'text-gray-700',
  textActive: 'text-white',
  shadow: 'shadow-green-500/30',
  border: 'border-white/40',
  gradient: 'from-green-400 to-green-600',
};

// Helper function to get colors
export const getDepartmentColor = (dept: string) => {
  return DEPARTMENT_COLORS[dept as keyof typeof DEPARTMENT_COLORS] || DEFAULT_COLOR;
};

export const getStatusColor = (status: string) => {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || DEFAULT_COLOR;
};

export const getPriorityColor = (priority: string) => {
  return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || DEFAULT_COLOR;
};

