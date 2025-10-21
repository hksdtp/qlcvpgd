import React, { useState, useRef, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, DEPARTMENTS, DEPARTMENT_COLORS, STATUS_COLORS, PRIORITY_COLORS } from '../types';
import { DepartmentIcons, DepartmentIconsSolid, PriorityIcons, PriorityIconsSolid, StatusIcons, StatusIconsSolid } from './IconLibrary';

// Status configurations

// Legacy icons - will be replaced by IconLibrary
const DEPARTMENT_ICONS_OLD: { [key: string]: JSX.Element } = {
    'CV Chung': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
        </svg>
    ),
    'Marketing': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
    ),
    'Development': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
    ),
    'Sản xuất/ Kỹ Thuật': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
    ),
    'Kinh doanh': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
    ),
    'Nhân sự': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
    )
};

// Gmail-style SVG icons for status
const STATUS_ICONS: { [key: string]: JSX.Element } = {
    'Chưa làm': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
    ),
    'Đang làm': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
    ),
    'Lên Kế Hoạch': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
    ),
    'Đang Review': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
    ),
    'Hoàn thành': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    ),
    'Tạm dừng': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
    ),
    'Hủy bỏ': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
    )
};



// Status colors imported from types.ts for consistency

interface FilterMenuProps {
    selectedDepartment: string;
    selectedStatus: string;
    selectedPriority: string;
    onDepartmentChange: (department: string) => void;
    onStatusChange: (status: string) => void;
    onPriorityChange: (priority: string) => void;
    departmentCounts: { [key: string]: number };
    statusCounts: { [key: string]: number };
    priorityCounts: { [key: string]: number };
    totalTasks: number;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
    selectedDepartment,
    selectedStatus,
    selectedPriority,
    onDepartmentChange,
    onStatusChange,
    onPriorityChange,
    departmentCounts,
    statusCounts,
    priorityCounts,
    totalTasks
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const hasActiveFilters = selectedDepartment || selectedStatus || selectedPriority;

    return (
        <div className="relative" ref={menuRef}>
            {/* Filter Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                    hasActiveFilters
                        ? 'bg-apple-blue/10 text-apple-blue hover:bg-apple-blue/20'
                        : 'text-light-text-secondary hover:text-apple-blue hover:bg-white/30'
                }`}
                title="Bộ lọc"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                {hasActiveFilters && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-apple-blue rounded-full shadow-apple animate-scale-in"></div>
                )}
            </button>

            {/* Gmail-style Sidebar */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)}></div>

                    {/* Sidebar */}
                    <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gmail-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-apple-blue rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">M</span>
                                </div>
                                <h3 className="font-medium text-gmail-gray-800">Quản lý công việc</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gmail-gray-100 rounded-full transition-colors duration-150"
                            >
                                <svg className="w-5 h-5 text-gmail-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modern Navigation */}
                        <div className="p-3">
                            {/* All Tasks */}
                            <button
                                onClick={() => {
                                    onDepartmentChange('');
                                    onStatusChange('');
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-150 ${
                                    !selectedDepartment && !selectedStatus && !selectedPriority
                                        ? 'bg-blue-50 text-apple-blue'
                                        : 'text-gmail-gray-700 hover:bg-gmail-gray-100'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    !selectedDepartment && !selectedStatus && !selectedPriority ? 'bg-apple-blue text-white' : 'bg-gmail-gray-200 text-gmail-gray-600'
                                }`}>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="flex-1 font-medium">Tất cả công việc</span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                    !selectedDepartment && !selectedStatus && !selectedPriority
                                        ? 'bg-apple-blue text-white'
                                        : 'bg-gmail-gray-200 text-gmail-gray-600'
                                }`}>
                                    {totalTasks > 99 ? '99+' : totalTasks}
                                </span>
                            </button>

                            {/* Department Section */}
                            <div className="mt-4">
                                <div className="px-2 mb-1">
                                    <h4 className="text-xs font-medium text-gmail-gray-600 uppercase tracking-wide">Phòng ban</h4>
                                </div>
                                <div className="space-y-0.5">
                                    {DEPARTMENTS.map(dept => {
                                        const count = departmentCounts[dept] || 0;
                                        if (count === 0) return null;
                                        const isActive = selectedDepartment === dept;
                                        return (
                                            <button
                                                key={dept}
                                                onClick={() => {
                                                    onDepartmentChange(dept);
                                                    onStatusChange('');
                                                    onPriorityChange('');
                                                    setIsOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-150 ${
                                                    isActive
                                                        ? 'bg-blue-50 text-apple-blue'
                                                        : 'text-gmail-gray-700 hover:bg-gmail-gray-100'
                                                }`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                    isActive ? 'bg-apple-blue text-white' : 'bg-gmail-gray-200 text-gmail-gray-600'
                                                }`}>
                                                    {isActive
                                                        ? DepartmentIconsSolid[dept]?.({ className: "w-4 h-4" })
                                                        : DepartmentIcons[dept]?.({ className: "w-4 h-4" })
                                                    }
                                                </div>
                                                <span className="flex-1 font-medium text-sm">{dept}</span>
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                                    isActive ? 'bg-apple-blue text-white' : 'bg-gmail-gray-200 text-gmail-gray-600'
                                                }`}>
                                                    {count > 99 ? '99+' : count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Status Section */}
                            <div className="mt-6">
                                <div className="px-2 mb-2">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</h4>
                                </div>
                                <div className="space-y-1">
                                    {Object.keys(statusCounts).map(status => {
                                        const count = statusCounts[status] || 0;
                                        if (count === 0) return null;
                                        const isActive = selectedStatus === status;
                                        return (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    onStatusChange(status);
                                                    onDepartmentChange('');
                                                    onPriorityChange('');
                                                    setIsOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                                                    isActive
                                                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 shadow-sm border-2 border-green-200'
                                                        : 'text-slate-700 hover:bg-slate-100'
                                                }`}
                                            >
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                                    isActive ? 'bg-green-100' : 'bg-slate-100'
                                                }`}>
                                                    {isActive
                                                        ? StatusIconsSolid[status]?.({ className: "w-5 h-5" })
                                                        : StatusIcons[status]?.({ className: "w-5 h-5" })
                                                    }
                                                </div>
                                                <span className="flex-1 font-semibold">{status}</span>
                                                <span className={`text-xs font-bold px-2.5 py-1.5 rounded-full ${
                                                    isActive ? 'bg-green-200 text-green-800' : 'bg-slate-200 text-slate-600'
                                                }`}>
                                                    {count > 99 ? '99+' : count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Priority Section */}
                            <div className="mt-6">
                                <div className="px-2 mb-2">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Độ ưu tiên</h4>
                                </div>
                                <div className="space-y-1">
                                    {Object.keys(priorityCounts).map(priority => {
                                        const count = priorityCounts[priority] || 0;
                                        if (count === 0) return null;
                                        const isActive = selectedPriority === priority;

                                        // Định nghĩa màu sắc cho từng mức độ ưu tiên
                                        const priorityStyles = {
                                            'CAO': {
                                                bg: isActive ? 'bg-gradient-to-r from-red-50 to-rose-50' : '',
                                                border: isActive ? 'border-2 border-red-200' : '',
                                                text: isActive ? 'text-red-700' : 'text-slate-700',
                                                iconBg: isActive ? 'bg-red-100' : 'bg-slate-100',
                                                iconColor: 'text-red-600',
                                                badgeBg: isActive ? 'bg-red-200 text-red-800' : 'bg-slate-200 text-slate-600'
                                            },
                                            'TRUNG BÌNH': {
                                                bg: isActive ? 'bg-gradient-to-r from-yellow-50 to-amber-50' : '',
                                                border: isActive ? 'border-2 border-yellow-200' : '',
                                                text: isActive ? 'text-yellow-700' : 'text-slate-700',
                                                iconBg: isActive ? 'bg-yellow-100' : 'bg-slate-100',
                                                iconColor: 'text-yellow-600',
                                                badgeBg: isActive ? 'bg-yellow-200 text-yellow-800' : 'bg-slate-200 text-slate-600'
                                            },
                                            'THẤP': {
                                                bg: isActive ? 'bg-gradient-to-r from-green-50 to-emerald-50' : '',
                                                border: isActive ? 'border-2 border-green-200' : '',
                                                text: isActive ? 'text-green-700' : 'text-slate-700',
                                                iconBg: isActive ? 'bg-green-100' : 'bg-slate-100',
                                                iconColor: 'text-green-600',
                                                badgeBg: isActive ? 'bg-green-200 text-green-800' : 'bg-slate-200 text-slate-600'
                                            }
                                        };

                                        const style = priorityStyles[priority as keyof typeof priorityStyles] || priorityStyles['THẤP'];

                                        return (
                                            <button
                                                key={priority}
                                                onClick={() => {
                                                    onPriorityChange(priority);
                                                    onDepartmentChange('');
                                                    onStatusChange('');
                                                    setIsOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                                                    isActive
                                                        ? `${style.bg} ${style.text} shadow-sm ${style.border}`
                                                        : 'text-slate-700 hover:bg-slate-100'
                                                }`}
                                            >
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${style.iconBg}`}>
                                                    {isActive
                                                        ? PriorityIconsSolid[priority]?.({ className: "w-5 h-5" })
                                                        : PriorityIcons[priority]?.({ className: "w-5 h-5" })
                                                    }
                                                </div>
                                                <span className="flex-1 font-semibold">{priority}</span>
                                                <span className={`text-xs font-bold px-2.5 py-1.5 rounded-full ${style.badgeBg}`}>
                                                    {count > 99 ? '99+' : count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Clear All Button */}
                            {hasActiveFilters && (
                                <div className="mt-6 pt-4 border-t border-slate-200">
                                    <button
                                        onClick={() => {
                                            onDepartmentChange('');
                                            onStatusChange('');
                                            onPriorityChange('');
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border-2 border-red-200 transition-all duration-200 font-bold shadow-sm hover:shadow-md"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Xóa tất cả bộ lọc</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FilterMenu;
