// FIX: Define TaskStatus enum and interfaces for Subtask and Task.
export enum TaskStatus {
  NotStarted = 'Chưa làm',
  Planning = 'Lên Kế Hoạch',
  ToDo = 'Cần làm',
  InProgress = 'Đang làm',
  Done = 'Hoàn thành',
  Backlog = 'Tồn đọng',
  Stopped = 'Dừng',
}

// Department options for Vietnamese companies
export const DEPARTMENTS = [
  'Kinh Doanh',
  'Sản xuất/ Kỹ Thuật',
  'Hành Chính Nhân Sự',
  'Marketing',
  'CV Chung',
  'CV Khác'
] as const;

export type Department = typeof DEPARTMENTS[number];

// Department Colors - Consistent across all components
export const DEPARTMENT_COLORS: { [key: string]: string } = {
    'Kinh Doanh': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    'Sản xuất/ Kỹ Thuật': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    'Hành Chính Nhân Sự': 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    'Marketing': 'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200',
    'CV Chung': 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
    'CV Khác': 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'
};

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO string
  completedAt?: string; // ISO string, optional
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string; // ISO string
  updatedAt?: string; // ISO string, for edited comments
  likes: number;
  likedBy: string[]; // Array of user IDs who liked this comment
  isEdited?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  subtasks: Subtask[];
  comments: Comment[];
  createdAt: string; // ISO string
  department?: string;
  isRead?: boolean; // Gmail-style read/unread state
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'marketing_lead' | 'member';
  allowedDepartments?: Department[]; // Departments this user can view
}

// User permissions configuration
export const USER_PERMISSIONS = {
  'Ms Nhung': ['Marketing', 'CV Chung'] as Department[],
  'Sếp Hạnh': DEPARTMENTS as readonly Department[], // Can view all
  'Mr Hùng': DEPARTMENTS.filter(dept => dept !== 'CV Khác') as Department[], // All except CV Khác
} as const;

export interface SelectOption {
  value: string;
  label: string;
}