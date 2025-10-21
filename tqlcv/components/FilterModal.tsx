import React from 'react';
import { TaskStatus, TaskPriority } from '../types';
import { getStatusColor, getPriorityColor, DEFAULT_COLOR } from '../constants/filterColors';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStatus: TaskStatus | '';
  selectedPriority: TaskPriority | '';
  onStatusChange: (status: TaskStatus | '') => void;
  onPriorityChange: (priority: TaskPriority | '') => void;
  statusCounts: { [key: string]: number };
  priorityCounts: { [key: string]: number };
}

// iOS-style Icons (same as FilterPills)
const FilterIcons = {
  status: (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  priority: (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/>
    </svg>
  ),
  statuses: {
    'Chưa làm': (
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
      </svg>
    ),
    'Đang làm': (
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    'Hoàn thành': (
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        <circle cx="12" cy="12" r="10" opacity="0.3"/>
      </svg>
    ),
  },
  priorities: {
    'CAO': (
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/>
        <path d="M14 4l.4 2H20v10h-7l-.4-2H7v7H5V4h9z" opacity="0.5"/>
      </svg>
    ),
    'TRUNG BÌNH': (
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/>
      </svg>
    ),
    'THẤP': (
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" opacity="0.4"/>
      </svg>
    ),
  },
};

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedStatus,
  selectedPriority,
  onStatusChange,
  onPriorityChange,
  statusCounts,
  priorityCounts,
}) => {
  if (!isOpen) return null;

  const handleStatusClick = (status: TaskStatus | '') => {
    onStatusChange(status);
    onClose();
  };

  const handlePriorityClick = (priority: TaskPriority | '') => {
    onPriorityChange(priority);
    onClose();
  };

  const handleClearAll = () => {
    onStatusChange('');
    onPriorityChange('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        style={{
          animation: 'fadeIn 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
        }}
      ></div>

      {/* Modal - iOS Mail style */}
      <div
        className="relative bg-gray-100 rounded-t-[30px] md:rounded-[30px] shadow-2xl w-full md:max-w-md max-h-[85vh] overflow-hidden"
        style={{
          animation: 'slideUpModal 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
        }}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between bg-gray-100">
          <h2 className="text-[17px] font-semibold text-gray-900">Bộ lọc</h2>
          <button
            onClick={handleClearAll}
            className="w-10 h-10 rounded-full bg-[#007AFF] flex items-center justify-center active:scale-95 transition-all shadow-md"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>

        {/* Content - iOS Mail style */}
        <div className="px-4 py-4 overflow-y-auto max-h-[calc(85vh-80px)] space-y-6">
          {/* Status Section */}
          <div>
            <h3 className="text-[13px] font-semibold text-gray-500 mb-2 px-2">
              TRẠNG THÁI
            </h3>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Individual Statuses */}
              {Object.keys(statusCounts).map((status, index) => {
                const count = statusCounts[status] || 0;
                if (count === 0) return null;
                const isActive = selectedStatus === status;
                const colors = getStatusColor(status);
                const isLast = index === Object.keys(statusCounts).filter(s => statusCounts[s] > 0).length - 1;

                return (
                  <div key={status}>
                    <button
                      onClick={() => handleStatusClick(status as TaskStatus)}
                      className="w-full flex items-center justify-between px-4 py-3.5 active:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon with color */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colors.bgInactive}`}>
                          <div className={`w-3 h-3 rounded-full ${colors.bgActive}`}></div>
                        </div>
                        <span className="text-[17px] text-gray-900">{status}</span>
                      </div>

                      {/* Checkmark */}
                      {isActive && (
                        <svg className="w-6 h-6 text-[#007AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    {!isLast && <div className="h-px bg-gray-200 ml-14"></div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Section */}
          <div>
            <h3 className="text-[13px] font-semibold text-gray-500 mb-2 px-2">
              ĐỘ ƯU TIÊN
            </h3>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Individual Priorities */}
              {Object.keys(priorityCounts).map((priority, index) => {
                const count = priorityCounts[priority] || 0;
                if (count === 0) return null;
                const isActive = selectedPriority === priority;
                const colors = getPriorityColor(priority);
                const isLast = index === Object.keys(priorityCounts).filter(p => priorityCounts[p] > 0).length - 1;

                return (
                  <div key={priority}>
                    <button
                      onClick={() => handlePriorityClick(priority as TaskPriority)}
                      className="w-full flex items-center justify-between px-4 py-3.5 active:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon with color */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colors.bgInactive}`}>
                          <svg className={`w-3.5 h-3.5 ${colors.textActive}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/>
                          </svg>
                        </div>
                        <span className="text-[17px] text-gray-900">{priority}</span>
                      </div>

                      {/* Checkmark */}
                      {isActive && (
                        <svg className="w-6 h-6 text-[#007AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    {!isLast && <div className="h-px bg-gray-200 ml-14"></div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* iOS-style animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpModal {
          from {
            transform: translateY(100%);
            opacity: 0.8;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default FilterModal;

