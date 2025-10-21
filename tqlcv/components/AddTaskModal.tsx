// iOS-style glassmorphism AddTaskModal with color-coded badges
import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, SelectOption, DEPARTMENTS } from '../types';
import { CloseIcon } from './icons';
import { useVietnameseInput } from '../hooks/useVietnameseInput';
import { getDepartmentColor, getStatusColor, getPriorityColor } from '../constants/filterColors';
import { DatePicker } from './DatePicker';
import { Calendar } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'subtasks'>) => void;
}

const statusOptions: SelectOption[] = [
  { value: TaskStatus.NotStarted, label: TaskStatus.NotStarted },
  { value: TaskStatus.Planning, label: TaskStatus.Planning },
  { value: TaskStatus.ToDo, label: TaskStatus.ToDo },
  { value: TaskStatus.InProgress, label: TaskStatus.InProgress },
  { value: TaskStatus.Done, label: TaskStatus.Done },
  { value: TaskStatus.Backlog, label: TaskStatus.Backlog },
  { value: TaskStatus.Stopped, label: TaskStatus.Stopped },
];

const departmentOptions: SelectOption[] = DEPARTMENTS.map(dept => ({
  value: dept,
  label: dept
}));

const priorityOptions: SelectOption[] = [
  { value: TaskPriority.High, label: TaskPriority.High },
  { value: TaskPriority.Medium, label: TaskPriority.Medium },
  { value: TaskPriority.Low, label: TaskPriority.Low },
];


const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.NotStarted);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [department, setDepartment] = useState('CV Chung');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [startDateButtonRef, setStartDateButtonRef] = useState<HTMLElement | null>(null);
  const [dueDateButtonRef, setDueDateButtonRef] = useState<HTMLElement | null>(null);

  // Vietnamese input support
  const titleInput = useVietnameseInput({
    value: title,
    onChange: setTitle
  });

  const descriptionInput = useVietnameseInput({
    value: description,
    onChange: setDescription
  });

  // Helper function to format date (same as TaskDetailModal)
  const formatDisplayDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'Chọn ngày';

    try {
      const date = new Date(dateStr);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return 'Chọn ngày';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title,
      description,
      status,
      priority,
      department,
      comments: [], // Initialize empty comments array with proper structure
      startDate: startDate || undefined,
      dueDate: dueDate || undefined
    });
    setTitle('');
    setDescription('');
    setStatus(TaskStatus.NotStarted);
    setPriority(TaskPriority.Medium);
    setDepartment('CV Chung');
    setStartDate('');
    setDueDate('');
    onClose();
  };

  if (!isOpen) return null;

  const statusColors = getStatusColor(status);
  const priorityColors = getPriorityColor(priority);
  const departmentColors = getDepartmentColor(department);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container - iOS Mail style */}
      <div className="relative w-full md:max-w-lg bg-white rounded-t-[30px] md:rounded-3xl shadow-2xl overflow-hidden animate-slide-up md:animate-scale-in max-h-[90vh] flex flex-col">
        {/* Header - iOS Mail style */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg font-semibold transition-all duration-200"
          >
            Tạo
          </button>
        </div>

        {/* Title */}
        <div className="px-6 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Công việc mới</h1>
        </div>

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 space-y-0">
            {/* Title Input - Borderless iOS style */}
            <div className="border-b border-gray-200 pb-3">
              <label htmlFor="title" className="block text-sm text-gray-400 mb-1">
                Tiêu đề
              </label>
              <input
                type="text"
                id="title"
                {...titleInput}
                className="w-full px-0 py-2 bg-transparent border-0 text-gray-900 text-lg placeholder:text-gray-400 focus:outline-none focus:ring-0"
                style={{ fontSize: '17px', WebkitAppearance: 'none' }}
                placeholder="Nhập tiêu đề công việc"
                lang="vi"
                autoComplete="off"
                spellCheck="true"
                required
              />
            </div>

            {/* Description Textarea - Borderless iOS style */}
            <div className="border-b border-gray-200 py-3">
              <label htmlFor="description" className="block text-sm text-gray-400 mb-1">
                Mô tả
              </label>
              <textarea
                id="description"
                rows={4}
                {...descriptionInput}
                className="w-full px-0 py-2 bg-transparent border-0 text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:ring-0 resize-none"
                style={{ fontSize: '16px', WebkitAppearance: 'none' }}
                placeholder="Thêm mô tả chi tiết..."
                lang="vi"
                autoComplete="off"
                spellCheck="true"
              />
            </div>
          </div>

          {/* Status, Priority, Department - iOS style badges */}
          <div className="px-6 space-y-5 pt-4 pb-6">
            {/* Status */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Trạng thái</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(option => {
                  const isSelected = status === option.value;
                  const colors = getStatusColor(option.value as TaskStatus);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStatus(option.value as TaskStatus)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                        ${isSelected
                          ? `${colors.bgActive} ${colors.textActive} shadow-md`
                          : `${colors.bgInactive} ${colors.text} hover:shadow-sm`
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Ưu tiên</label>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map(option => {
                  const isSelected = priority === option.value;
                  const colors = getPriorityColor(option.value as TaskPriority);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPriority(option.value as TaskPriority)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                        ${isSelected
                          ? `${colors.bgActive} ${colors.textActive} shadow-md`
                          : `${colors.bgInactive} ${colors.text} hover:shadow-sm`
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Phòng ban</label>
              <div className="flex flex-wrap gap-2">
                {departmentOptions.map(option => {
                  const isSelected = department === option.value;
                  const colors = getDepartmentColor(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDepartment(option.value)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                        ${isSelected
                          ? `${colors.bgActive} ${colors.textActive} shadow-md`
                          : `${colors.bgInactive} ${colors.text} hover:shadow-sm`
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Pickers - iOS style (same as TaskDetailModal) */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Ngày tháng</label>
              <div className="flex flex-wrap items-center gap-3">
                {/* Start Date Button */}
                <button
                  type="button"
                  ref={(el) => setStartDateButtonRef(el)}
                  onClick={(e) => {
                    setStartDateButtonRef(e.currentTarget);
                    setShowStartDatePicker(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-green-100 text-green-700 hover:shadow-lg hover:scale-105"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs text-green-600 mr-1">Ngày bắt đầu:</span>
                  <span>{formatDisplayDate(startDate)}</span>
                </button>

                {/* Due Date Button */}
                <button
                  type="button"
                  ref={(el) => setDueDateButtonRef(el)}
                  onClick={(e) => {
                    setDueDateButtonRef(e.currentTarget);
                    setShowDueDatePicker(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-orange-100 text-orange-700 hover:shadow-lg hover:scale-105"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs text-orange-600 mr-1">Ngày deadline:</span>
                  <span>{formatDisplayDate(dueDate)}</span>
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>

      {/* Start Date Picker */}
      <DatePicker
        isOpen={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        selectedDate={startDate}
        onSelect={(date) => setStartDate(date || '')}
        anchorEl={startDateButtonRef}
        title="Chọn ngày bắt đầu"
      />

      {/* Due Date Picker */}
      <DatePicker
        isOpen={showDueDatePicker}
        onClose={() => setShowDueDatePicker(false)}
        selectedDate={dueDate}
        onSelect={(date) => setDueDate(date || '')}
        anchorEl={dueDateButtonRef}
        title="Chọn ngày deadline"
      />

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
};

export default AddTaskModal;