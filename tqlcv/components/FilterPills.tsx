import React from 'react';
import { TaskStatus, TaskPriority, DEPARTMENTS } from '../types';
import { getDepartmentColor, DEFAULT_COLOR } from '../constants/filterColors';
import { DEPARTMENT_ICONS, getDepartmentIcon } from '../constants/iconMapping';
import { List, Building2, CheckCircle, Flag } from 'lucide-react';

interface FilterPillsProps {
  selectedDepartment: string;
  selectedStatus: TaskStatus | '';
  selectedPriority: TaskPriority | '';
  onDepartmentChange: (dept: string) => void;
  onStatusChange: (status: TaskStatus | '') => void;
  onPriorityChange: (priority: TaskPriority | '') => void;
  departmentCounts: { [key: string]: number };
  statusCounts: { [key: string]: number };
  priorityCounts: { [key: string]: number };
  totalTasks: number;
}

const FilterPills: React.FC<FilterPillsProps> = ({
  selectedDepartment,
  selectedStatus,
  selectedPriority,
  onDepartmentChange,
  onStatusChange,
  onPriorityChange,
  departmentCounts,
  statusCounts,
  priorityCounts,
  totalTasks,
}) => {
  const isAllActive = !selectedDepartment && !selectedStatus && !selectedPriority;

  return (
    <div className="px-4 md:px-6 lg:px-8 mb-4">
      {/* Horizontal scrollable pills - Only All Tasks + Departments */}
      <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar">
        {/* All Tasks Pill - iOS-style smooth animation */}
        <button
          onClick={() => {
            onDepartmentChange('');
            onStatusChange('');
            onPriorityChange('');
          }}
          className={`
            group relative flex items-center justify-center gap-2 rounded-full whitespace-nowrap flex-shrink-0
            px-4 md:px-5 py-2 md:py-2.5
            ${isAllActive
              ? 'bg-[#34C759] text-white shadow-lg shadow-green-500/30'
              : 'bg-white/40 backdrop-blur-xl text-gray-700 hover:shadow-md'
            }
          `}
          style={{
            transition: 'background-color 0.15s ease-out, box-shadow 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {/* Icon - instant color change */}
          <span
            className="w-5 h-5 md:w-6 md:h-6"
            style={{
              color: 'inherit',
              transition: 'color 0.15s ease-out',
            }}
          >
            <List className="w-full h-full" strokeWidth={2} />
          </span>

          {/* Ripple effect on click */}
          <span className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 group-active:animate-ripple bg-white/30"></span>
        </button>

        {/* Department Pills - iOS-style smooth animation */}
        {DEPARTMENTS.map(dept => {
          const count = departmentCounts[dept] || 0;
          if (count === 0) return null;
          const isActive = selectedDepartment === dept;
          const DeptIcon = getDepartmentIcon(dept);
          const colors = getDepartmentColor(dept);
          return (
            <button
              key={dept}
              onClick={() => {
                onDepartmentChange(dept);
                onStatusChange('');
                onPriorityChange('');
              }}
              className={`
                group relative flex items-center rounded-full whitespace-nowrap flex-shrink-0
                py-2 md:py-2.5
                ${isActive
                  ? `${colors.bgActive} ${colors.textActive} shadow-lg ${colors.shadow}`
                  : `${colors.bgInactive} backdrop-blur-xl ${colors.text} hover:shadow-md`
                }
              `}
              style={{
                paddingLeft: isActive ? '1.25rem' : '0.75rem',
                paddingRight: isActive ? '1.25rem' : '0.75rem',
                gap: isActive ? '0.5rem' : '0',
                transition: 'padding 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94), gap 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.15s ease-out, box-shadow 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              {/* Icon - instant color change */}
              <span
                className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0"
                style={{
                  color: 'inherit',
                  transition: 'color 0.15s ease-out',
                }}
              >
                <DeptIcon className="w-full h-full" strokeWidth={2} />
              </span>

              {/* Text with smooth fade-in and width animation */}
              <span
                className="text-[15px] md:text-base overflow-hidden whitespace-nowrap"
                style={{
                  maxWidth: isActive ? '200px' : '0',
                  opacity: isActive ? 1 : 0,
                  transition: 'max-width 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: isActive ? '0.05s' : '0s',
                }}
              >
                {dept}
              </span>

              {/* Ripple effect on click */}
              <span className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 group-active:animate-ripple bg-white/30"></span>
            </button>
          );
        })}
      </div>

      {/* Hide scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default FilterPills;

