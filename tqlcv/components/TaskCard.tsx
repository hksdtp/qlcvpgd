import React from 'react';
import { Task, TaskStatus, DEPARTMENT_COLORS } from '../types';

// Status colors

const STATUS_COLORS: { [key: string]: string } = {
    'Chưa làm': 'bg-gray-100 text-gray-800 border-gray-200',
    'Đang làm': 'bg-blue-100 text-blue-800 border-blue-200',
    'Lên Kế Hoạch': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Đang Review': 'bg-orange-100 text-orange-800 border-orange-200',
    'Hoàn thành': 'bg-green-100 text-green-800 border-green-200',
    'Tạm dừng': 'bg-red-100 text-red-800 border-red-200',
    'Hủy bỏ': 'bg-slate-100 text-slate-800 border-slate-200'
};

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onSelect: (task: Task) => void;
}

const statusConfig = {
    'Chưa làm': {
        dotClasses: 'bg-gray-500',
    },
    'Lên Kế Hoạch': {
        dotClasses: 'bg-blue-500',
    },
    'Cần làm': {
        dotClasses: 'bg-red-500',
    },
    'Đang làm': {
        dotClasses: 'bg-yellow-500',
    },
    'Hoàn thành': {
        dotClasses: 'bg-green-500',
    },
    'Tồn đọng': {
        dotClasses: 'bg-orange-500',
    },
    'Dừng': {
        dotClasses: 'bg-purple-500',
    }
};



const TaskCard: React.FC<TaskCardProps> = ({ task, isSelected, onSelect }) => {
    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
    const totalSubtasks = task.subtasks.length;

    // Gmail-style unread styling
    const isUnread = !task.isRead;
    
    return (
        <article
            onClick={() => onSelect(task)}
            className={`flex items-start gap-4 p-4 border-b border-slate-200/80 cursor-pointer macos-hover ios-button no-zoom card-appear ${isSelected ? 'bg-indigo-100/60' : 'hover:bg-slate-100/50'} ${isUnread ? 'bg-white' : 'bg-gray-50/30'}`}
        >
            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusConfig[task.status]?.dotClasses || 'bg-gray-500'}`}></div>
            <div className="flex-grow overflow-hidden">
                {/* Department and Status badges - Top priority */}
                <div className="flex items-center gap-2 mb-2">
                    {task.department && (
                        <span className={`px-2 py-0.5 rounded-full border font-medium text-xs ${DEPARTMENT_COLORS[task.department] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                            {task.department}
                        </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full border font-medium text-xs ${STATUS_COLORS[task.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {task.status}
                    </span>
                </div>

                {/* Title and Date */}
                <div className="flex justify-between items-baseline">
                    <h3 className={`text-sm truncate pr-4 font-roboto ${isUnread ? 'font-bold text-gmail-gray-900' : 'font-normal text-gmail-gray-700'}`}>{task.title}</h3>
                    <span className="text-xs text-gmail-gray-500 flex-shrink-0 font-roboto">{new Date(task.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>

                {/* Description */}
                <p className={`text-gmail-gray-600 text-xs truncate mt-1 font-roboto ${isUnread ? 'font-medium' : 'font-normal'}`}>{task.description || 'Không có mô tả'}</p>

                {/* Subtasks count - Bottom */}
                {totalSubtasks > 0 && (
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        <span>{`✓ ${completedSubtasks}/${totalSubtasks}`}</span>
                    </div>
                )}
            </div>
        </article>
    );
};

export default TaskCard;