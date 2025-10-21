import React from 'react';
import { ActionSheet } from './ActionSheet';
import { TaskPriority } from '../types';
import { Flag, CheckCircle2 } from 'lucide-react';

interface PriorityPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPriority: TaskPriority;
  onSelect: (priority: TaskPriority) => void;
  anchorEl?: HTMLElement | null;
}

interface PriorityOption {
  value: TaskPriority;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const priorityOptions: PriorityOption[] = [
  {
    value: TaskPriority.High,
    label: 'Cao',
    icon: <Flag className="w-4 h-4" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    value: TaskPriority.Medium,
    label: 'Trung bình',
    icon: <Flag className="w-4 h-4" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    value: TaskPriority.Low,
    label: 'Thấp',
    icon: <Flag className="w-4 h-4" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
];

export const PriorityPicker: React.FC<PriorityPickerProps> = ({
  isOpen,
  onClose,
  currentPriority,
  onSelect,
  anchorEl,
}) => {
  const handleSelect = (priority: TaskPriority) => {
    onSelect(priority);
    onClose();
  };

  return (
    <ActionSheet isOpen={isOpen} onClose={onClose} title="Chọn độ ưu tiên" anchorEl={anchorEl}>
      <div className="py-2">
        {priorityOptions.map((option, index) => {
          const isSelected = currentPriority === option.value;
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

