/**
 * ICON MAPPING - Single Source of Truth for All Icons
 * 
 * This file centralizes all icon mappings for departments, statuses, and priorities.
 * Using Lucide React icons for consistency, clarity, and professional appearance.
 * 
 * Usage:
 * import { DEPARTMENT_ICONS, STATUS_ICONS, PRIORITY_ICONS } from '../constants/iconMapping';
 * 
 * const Icon = DEPARTMENT_ICONS['Kinh Doanh'];
 * <Icon className="w-5 h-5" />
 */

import {
  // Department Icons
  TrendingUp,      // Kinh Doanh - Business growth
  Settings,        // Sản xuất/Kỹ Thuật - Technical/Engineering
  Users,           // Hành Chính Nhân Sự - HR/People
  Megaphone,       // Marketing - Advertising
  FileText,        // CV Chung - General documents
  FolderOpen,      // CV Khác - Other/Miscellaneous
  
  // Status Icons
  Circle,          // Chưa làm, Cần làm - Not started, To do
  Clock,           // Lên Kế Hoạch - Planning
  PlayCircle,      // Đang làm - In progress
  CheckCircle2,    // Hoàn thành - Done
  Archive,         // Tồn đọng - Backlog
  XCircle,         // Dừng - Stopped
  
  // Priority Icons
  Flag,            // All priorities use Flag with different colors
  
  // Other common icons
  Calendar,
  Tag,
  Save,
  Send,
  Heart,
  Reply,
  Paperclip,
  Download,
  X,
  Pause,
} from 'lucide-react';

// ============================================
// DEPARTMENT ICONS
// ============================================

export const DEPARTMENT_ICONS = {
  'Kinh Doanh': TrendingUp,
  'Sản xuất/ Kỹ Thuật': Settings,
  'Hành Chính Nhân Sự': Users,
  'Marketing': Megaphone,
  'CV Chung': FileText,
  'CV Khác': FolderOpen,
} as const;

export type DepartmentKey = keyof typeof DEPARTMENT_ICONS;

// ============================================
// STATUS ICONS
// ============================================

export const STATUS_ICONS = {
  'Chưa làm': Circle,
  'Lên Kế Hoạch': Clock,
  'Cần làm': Circle,
  'Đang làm': PlayCircle,
  'Hoàn thành': CheckCircle2,
  'Tồn đọng': Archive,
  'Dừng': XCircle,
} as const;

export type StatusKey = keyof typeof STATUS_ICONS;

// ============================================
// PRIORITY ICONS
// ============================================

export const PRIORITY_ICONS = {
  'CAO': Flag,
  'TRUNG BÌNH': Flag,
  'THẤP': Flag,
} as const;

export type PriorityKey = keyof typeof PRIORITY_ICONS;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get department icon component
 */
export const getDepartmentIcon = (department: string) => {
  return DEPARTMENT_ICONS[department as DepartmentKey] || DEPARTMENT_ICONS['CV Khác'];
};

/**
 * Get status icon component
 */
export const getStatusIcon = (status: string) => {
  return STATUS_ICONS[status as StatusKey] || STATUS_ICONS['Chưa làm'];
};

/**
 * Get priority icon component
 */
export const getPriorityIcon = (priority: string) => {
  return PRIORITY_ICONS[priority as PriorityKey] || PRIORITY_ICONS['TRUNG BÌNH'];
};

// ============================================
// ICON METADATA (for documentation)
// ============================================

export const ICON_METADATA = {
  departments: {
    'Kinh Doanh': {
      icon: 'TrendingUp',
      meaning: 'Biểu đồ tăng trưởng, doanh số',
      description: 'Mũi tên đi lên, thể hiện tăng trưởng kinh doanh',
    },
    'Sản xuất/ Kỹ Thuật': {
      icon: 'Settings',
      meaning: 'Bánh răng, cài đặt, kỹ thuật',
      description: 'Biểu tượng công cụ, máy móc, kỹ thuật',
    },
    'Hành Chính Nhân Sự': {
      icon: 'Users',
      meaning: 'Nhóm người, tổ chức',
      description: 'Quản lý con người, nhân sự',
    },
    'Marketing': {
      icon: 'Megaphone',
      meaning: 'Loa phóng thanh, quảng cáo',
      description: 'Truyền thông, marketing, quảng bá',
    },
    'CV Chung': {
      icon: 'FileText',
      meaning: 'Tài liệu văn bản',
      description: 'Công việc chung, tài liệu',
    },
    'CV Khác': {
      icon: 'FolderOpen',
      meaning: 'Thư mục mở',
      description: 'Công việc khác, tổng hợp',
    },
  },
  statuses: {
    'Chưa làm': {
      icon: 'Circle',
      meaning: 'Vòng tròn rỗng',
      description: 'Chưa bắt đầu, trống',
      color: 'gray',
    },
    'Lên Kế Hoạch': {
      icon: 'Clock',
      meaning: 'Đồng hồ',
      description: 'Đang lên kế hoạch, thời gian',
      color: 'purple',
    },
    'Cần làm': {
      icon: 'Circle',
      meaning: 'Vòng tròn rỗng',
      description: 'Cần thực hiện',
      color: 'blue',
    },
    'Đang làm': {
      icon: 'PlayCircle',
      meaning: 'Nút play',
      description: 'Đang thực hiện, đang chạy',
      color: 'yellow',
    },
    'Hoàn thành': {
      icon: 'CheckCircle2',
      meaning: 'Vòng tròn có dấu check',
      description: 'Đã hoàn thành',
      color: 'green',
    },
    'Tồn đọng': {
      icon: 'Archive',
      meaning: 'Hộp lưu trữ',
      description: 'Tồn đọng, chưa giải quyết',
      color: 'orange',
    },
    'Dừng': {
      icon: 'XCircle',
      meaning: 'Vòng tròn có dấu X',
      description: 'Đã dừng, hủy bỏ',
      color: 'red',
    },
  },
  priorities: {
    'CAO': {
      icon: 'Flag',
      meaning: 'Cờ đỏ',
      description: 'Ưu tiên cao, quan trọng',
      color: 'red',
    },
    'TRUNG BÌNH': {
      icon: 'Flag',
      meaning: 'Cờ vàng',
      description: 'Ưu tiên trung bình',
      color: 'yellow',
    },
    'THẤP': {
      icon: 'Flag',
      meaning: 'Cờ xám',
      description: 'Ưu tiên thấp',
      color: 'gray',
    },
  },
} as const;

