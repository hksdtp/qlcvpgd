import React from 'react';
import { ActionSheet } from './ActionSheet';
import { TaskStatus } from '../types';
import { Circle, PlayCircle, Clock, CheckCircle2, XCircle, Pause, Archive } from 'lucide-react';

interface StatusPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: TaskStatus;
  onSelect: (status: TaskStatus) => void;
  anchorEl?: HTMLElement | null;
}

interface StatusOption {
  value: TaskStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const statusOptions: StatusOption[] = [
  {
    value: TaskStatus.NotStarted,
    label: 'Chưa làm',
    icon: <Circle className="w-5 h-5" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  {
    value: TaskStatus.Planning,
    label: 'Lên Kế Hoạch',
    icon: <Clock className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    value: TaskStatus.ToDo,
    label: 'Cần làm',
    icon: <Circle className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    value: TaskStatus.InProgress,
    label: 'Đang làm',
    icon: <PlayCircle className="w-5 h-5" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    value: TaskStatus.Done,
    label: 'Hoàn thành',
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    value: TaskStatus.Backlog,
    label: 'Tồn đọng',
    icon: <Archive className="w-5 h-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    value: TaskStatus.Stopped,
    label: 'Dừng',
    icon: <XCircle className="w-5 h-5" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
];

export const StatusPicker: React.FC<StatusPickerProps> = ({
  isOpen,
  onClose,
  currentStatus,
  onSelect,
  anchorEl,
}) => {
  const handleSelect = (status: TaskStatus) => {
    onSelect(status);
    onClose();
  };

  return (
    <ActionSheet isOpen={isOpen} onClose={onClose} title="Chọn trạng thái" anchorEl={anchorEl}>
      <div className="py-2">
        {statusOptions.map((option, index) => {
          const isSelected = currentStatus === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`
                w-full px-6 py-4 flex items-center gap-4 transition-all duration-150
                ${index > 0 ? 'border-t border-gray-200/50' : ''}
                ${isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50 active:bg-gray-100'}
              `}
            >
              {/* Icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${option.bgColor}`}>
                <div className={option.color}>
                  {option.icon}
                </div>
              </div>

              {/* Label */}
              <span className={`flex-1 text-left text-base font-medium ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                {option.label}
              </span>

              {/* Checkmark */}
              {isSelected && (
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              )}
            </button>
          );
        })}
      </div>
    </ActionSheet>
  );
};

