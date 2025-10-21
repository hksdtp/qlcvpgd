import React from 'react';
import { Task } from '../types';
import { getDepartmentColor, getStatusColor, getPriorityColor } from '../constants/filterColors';
import { getDepartmentIcon } from '../constants/iconMapping';

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onSelect: (task: Task) => void;
}



const TaskCard: React.FC<TaskCardProps> = ({ task, isSelected, onSelect }) => {
    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
    const totalSubtasks = task.subtasks.length;

    // Gmail-style unread styling
    const isUnread = !task.isRead;

    // Get colors and icons based on department, status, priority
    const deptColors = getDepartmentColor(task.department || 'CV Khác');
    const statusColors = getStatusColor(task.status || 'Chưa làm');
    const priorityColors = getPriorityColor(task.priority || 'TRUNG BÌNH');

    // Get department icon from centralized mapping
    const DepartmentIcon = getDepartmentIcon(task.department || 'CV Khác');

    return (
        <article
            onClick={() => onSelect(task)}
            className={`
                cursor-pointer transition-colors duration-150
                px-4 md:px-5 lg:px-6 py-3 md:py-4 border-b border-gray-200/50 last:border-b-0
                ${isSelected
                    ? 'bg-white/20'
                    : 'active:bg-white/20'
                }
            `}
        >
            <div className="flex items-start gap-3 md:gap-4">
                {/* Blue Dot for unread (iOS style - 8px circle) */}
                {isUnread && (
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full flex-shrink-0 bg-[#007AFF] mt-2"></div>
                )}
                {!isUnread && (
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 flex-shrink-0 mt-2"></div>
                )}

                {/* Avatar Icon (iOS style with department color - ROUNDED) */}
                <div className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br ${deptColors.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                    <DepartmentIcon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Title and Time */}
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-[15px] md:text-base lg:text-lg text-black ${isUnread ? 'font-semibold' : 'font-medium'}`}>
                            {task.title}
                        </span>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <span className="text-[13px] md:text-sm text-gray-500">
                                {new Date(task.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })}
                            </span>
                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Status and Priority Badges on same line */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {task.status && (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors.bgActive} ${statusColors.textActive}`}>
                                {task.status}
                            </span>
                        )}
                        {task.priority && (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${priorityColors.bgActive} ${priorityColors.textActive}`}>
                                {task.priority}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {task.description && (
                        <div className="text-[14px] md:text-base text-gray-600 line-clamp-2">
                            {task.description}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

export default TaskCard;