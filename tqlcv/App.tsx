// Enhanced App component with PostgreSQL API
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, TaskStatus, User } from './types';
import KanbanColumn from './components/KanbanColumn';
import AddTaskModal from './components/AddTaskModal';
import UserSelection from './components/UserSelection';
import ErrorBoundary from './components/ErrorBoundary';
import { ArrowLeftOnRectangleIcon, PlusIcon, MagnifyingGlassIcon } from './components/icons';
import TaskDetailModal from './components/TaskDetailModal';
import FilterPills from './components/FilterPills';
import FilterModal from './components/FilterModal';
import LoadingSpinner from './components/LoadingSpinner';
import { useAPI } from './hooks/useAPI';

// Moved to FilterMenu.tsx and TaskDetail.tsx

// --- Sample Data ---
const users: User[] = [
    { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Sếp Hạnh', role: 'admin' },
    { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Mr Hùng', role: 'manager' },
    { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Ms Nhung', role: 'marketing_lead' },
    { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Ninh', role: 'member' },
];

interface SelectedUser {
    id: string
    name: string
    role: string
    avatar: string
    color: string
}

const NINH_USER_ID = '550e8400-e29b-41d4-a716-446655440004'; // Ninh user UUID

const initialTasks: Task[] = [
    {
        id: '1',
        title: 'Thiết kế giao diện cho trang đăng nhập',
        description: 'Tạo mockup và prototype cho luồng đăng nhập của người dùng, bao gồm cả xử lý lỗi và quên mật khẩu.',
        status: TaskStatus.ToDo,
        department: 'Marketing',
        subtasks: [
            { id: 's1-1', title: 'Vẽ wireframe', completed: true },
            { id: 's1-2', title: 'Tạo mockup high-fidelity', completed: false },
            { id: 's1-3', title: 'Tạo prototype tương tác', completed: false },
        ],
        createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
    },
    {
        id: '2',
        title: 'Phát triển API cho tính năng giỏ hàng',
        description: 'Xây dựng các endpoint RESTful để quản lý giỏ hàng: thêm, xóa, cập nhật sản phẩm.',
        status: TaskStatus.InProgress,
        department: 'Development',
        subtasks: [
            { id: 's2-1', title: 'Định nghĩa data model', completed: true },
            { id: 's2-2', title: 'Viết endpoint POST /cart', completed: true },
            { id: 's2-3', title: 'Viết endpoint GET /cart', completed: false },
            { id: 's2-4', title: 'Viết endpoint DELETE /cart/item/:id', completed: false },
        ],
        createdAt: new Date('2023-10-25T14:30:00Z').toISOString(),
    },
    {
        id: '3',
        title: 'Triển khai hệ thống xác thực người dùng',
        description: 'Tích hợp JWT (JSON Web Tokens) để bảo vệ các API và quản lý phiên đăng nhập của người dùng.',
        status: TaskStatus.Done,
        department: 'Development',
        subtasks: [
             { id: 's3-1', title: 'Cài đặt thư viện JWT', completed: true },
             { id: 's3-2', title: 'Tạo middleware xác thực', completed: true },
             { id: 's3-3', title: 'Áp dụng middleware cho các route cần bảo vệ', completed: true },
        ],
        createdAt: new Date('2023-10-24T09:00:00Z').toISOString(),
    }
];

// --- Helper Functions ---
const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const userColors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
];

const UserAvatar: React.FC<{ user: User }> = ({ user }) => {
    const colorIndex = user.id.charCodeAt(1) % userColors.length;
    return (
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 ${userColors[colorIndex]}`}>
            {getInitials(user.name)}
        </div>
    );
};





// --- App Component ---
const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedPriority, setSelectedPriority] = useState<string>('');

    // PostgreSQL API integration
    const api = useAPI();
    const { tasks, loading, error } = api;

    // Load user from localStorage - only run once on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        const savedSelectedUser = localStorage.getItem('selectedUser');

        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);

                // Check if user has old ID format (u1, u2, u3, u4)
                if (user.id && user.id.startsWith('u')) {
                    console.warn('⚠️ Detected old user ID format. Clearing localStorage...');
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('selectedUser');
                    console.log('✅ localStorage cleared. Please select user again.');
                    return;
                }

                setCurrentUser(user);
                console.log(`🔄 Restored user from localStorage: ${user.name} (${user.id})`);
            } catch (error) {
                console.error('Error loading user:', error);
            }
        }

        if (savedSelectedUser) {
            try {
                const selectedUserData = JSON.parse(savedSelectedUser);

                // Check if selected user has old ID format
                if (selectedUserData.id && selectedUserData.id.startsWith('u')) {
                    console.warn('⚠️ Detected old selected user ID format. Clearing localStorage...');
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('selectedUser');
                    console.log('✅ localStorage cleared. Please select user again.');
                    return;
                }

                setSelectedUser(selectedUserData);
            } catch (error) {
                console.error('Error loading selected user:', error);
            }
        }
    }, []); // Empty dependency array - only run once on mount

    // Handle user selection from UserSelection component
    const handleUserSelect = async (user: SelectedUser) => {
        try {
            setSelectedUser(user);
            localStorage.setItem('selectedUser', JSON.stringify(user));

            // Map selected user to current user for existing logic
            const mappedUser = users.find(u => u.name === user.name);
            if (mappedUser) {
                setCurrentUser(mappedUser);
                localStorage.setItem('currentUser', JSON.stringify(mappedUser));
                console.log(`🔄 User switched to: ${mappedUser.name} (${mappedUser.id})`);

                // Refresh tasks after user selection
                await api.refreshTasks();
            }
        } catch (error) {
            console.error('Error selecting user:', error);
            // Don't block user selection on API error
        }
    };

    // Clear selections when user changes
    useEffect(() => {
        if (currentUser) {
            setSelectedTask(null);
            setSearchQuery('');
        }
    }, [currentUser]);

    // Update selectedTask when tasks change (e.g., after adding comment)
    useEffect(() => {
        if (selectedTask) {
            const updatedTask = tasks.find(t => t.id === selectedTask.id);
            if (updatedTask) {
                setSelectedTask(updatedTask);
            }
        }
    }, [tasks]); // Only depend on tasks, not selectedTask to avoid infinite loop

    // Role-based permissions: Only restrict certain actions for specific roles
    // For now, allow all users to comment and interact
    const isReadOnly = false; // currentUser?.role === 'viewer'; // Uncomment if you want viewer-only role

    const handleAddTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'subtasks'>) => {
        if (isReadOnly) return;

        try {
            await api.addTask({
                ...taskData,
                subtasks: [],
                comments: taskData.comments || [],
                // createdBy: null, // Database will handle NULL for created_by (UUID type)
            });
            console.log('✅ Task added successfully');
        } catch (error) {
            console.error('❌ Failed to add task:', error);
        }
    }, [isReadOnly, api]);

    const handleSelectTask = useCallback((task: Task) => {
        setSelectedTask(task);
        // Mark task as read when selected (Gmail-style)
        if (!task.isRead) {
            const updatedTask = { ...task, isRead: true };
            // Update without setting selectedTask to avoid re-opening modal
            api.updateTask(task.id, { isRead: true }).catch(error => {
                console.error('❌ Failed to mark task as read:', error);
            });
        }
    }, [api]);

    const handleCloseDetail = useCallback(() => {
        setSelectedTask(null);
    }, []);

    const handleUpdateTask = useCallback(async (updatedTask: Task) => {
        if (isReadOnly) return;

        try {
            // Optimistic update: Update UI immediately
            setSelectedTask(updatedTask);

            // Sync with backend in background
            await api.updateTask(updatedTask.id, updatedTask);
            console.log('✅ Task updated successfully');
        } catch (error) {
            console.error('❌ Failed to update task:', error);
            // Revert on error (optional: could show error toast)
        }
    }, [isReadOnly, api]);

    const handleDeleteTask = useCallback(async (taskId: string) => {
        if (isReadOnly) return;

        try {
            await api.deleteTask(taskId);
            setSelectedTask(null);
            console.log('✅ Task deleted successfully');
        } catch (error) {
            console.error('❌ Failed to delete task:', error);
        }
    }, [isReadOnly, api]);

    const handleRefresh = useCallback(async () => {
        console.log('🔄 Refresh button clicked');
        try {
            console.log('📊 Current tasks count:', tasks.length);
            await api.refreshTasks();
            console.log('✅ Tasks refreshed from PostgreSQL');
            console.log('📊 New tasks count:', tasks.length);
        } catch (error) {
            console.error('❌ Failed to refresh:', error);
        }
    }, [tasks.length, api]);

    const filteredTasks = useMemo(() => {
        // Multi-level sorting: Priority → Status → CreatedAt
        const sorted = [...tasks].sort((a, b) => {
            // 1. Sort by Priority (CAO → TRUNG BÌNH → THẤP)
            const priorityOrder: { [key: string]: number } = {
                'CAO': 1,
                'TRUNG BÌNH': 2,
                'THẤP': 3
            };
            const priorityA = priorityOrder[a.priority || 'TRUNG BÌNH'] || 4;
            const priorityB = priorityOrder[b.priority || 'TRUNG BÌNH'] || 4;

            if (priorityA !== priorityB) {
                return priorityA - priorityB; // Lower number = higher priority
            }

            // 2. Sort by Status (Active statuses first)
            const statusOrder: { [key: string]: number } = {
                'Đang làm': 1,
                'Lên Kế Hoạch': 2,
                'Cần làm': 3,
                'Chưa làm': 4,
                'Tồn đọng': 5,
                'Dừng': 6,
                'Hoàn thành': 7
            };
            const statusA = statusOrder[a.status] || 8;
            const statusB = statusOrder[b.status] || 8;

            if (statusA !== statusB) {
                return statusA - statusB; // Lower number = higher priority
            }

            // 3. Sort by CreatedAt (Newest first)
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA; // Descending order (newest first)
        });

        // Apply department-based filtering based on user permissions
        let roleFiltered = sorted;
        if (selectedUser?.allowedDepartments && selectedUser.allowedDepartments.length > 0) {
            roleFiltered = sorted.filter(task => {
                // If task has no department, show it
                if (!task.department) return true;

                // Check if user's allowed departments includes task's department
                const isAllowed = selectedUser.allowedDepartments!.includes(task.department);

                // Debug logging
                if (!isAllowed) {
                    console.log(`🚫 Task "${task.title}" filtered out - Department: "${task.department}" not in allowed:`, selectedUser.allowedDepartments);
                }

                return isAllowed;
            });
        }

        return roleFiltered.filter(task => {
            // Search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchesSearch = task.title.toLowerCase().includes(query) ||
                    task.description?.toLowerCase().includes(query) ||
                    task.department?.toLowerCase().includes(query) ||
                    task.status.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Department filter
            if (selectedDepartment && task.department !== selectedDepartment) {
                return false;
            }

            // Status filter
            if (selectedStatus && task.status !== selectedStatus) {
                return false;
            }

            // Priority filter
            if (selectedPriority && task.priority !== selectedPriority) {
                return false;
            }

            return true;
        });
    }, [tasks, selectedUser, searchQuery, selectedDepartment, selectedStatus, selectedPriority]);

    // Get department counts
    const departmentCounts = useMemo(() => {
        const counts: { [key: string]: number } = {};
        tasks.forEach(task => {
            if (task.department) {
                counts[task.department] = (counts[task.department] || 0) + 1;
            }
        });
        return counts;
    }, [tasks]);

    // Get status counts
    const statusCounts = useMemo(() => {
        const counts: { [key: string]: number } = {};
        tasks.forEach(task => {
            counts[task.status] = (counts[task.status] || 0) + 1;
        });
        return counts;
    }, [tasks]);

    // Get priority counts
    const priorityCounts = useMemo(() => {
        const counts: { [key: string]: number } = {};
        filteredTasks.forEach(task => {
            if (task.priority) {
                counts[task.priority] = (counts[task.priority] || 0) + 1;
            }
        });
        return counts;
    }, [filteredTasks]);


    
    const userForHeader = isReadOnly ? users.find(u => u.id === NINH_USER_ID) : currentUser;
    
    const UserProfileHeader: React.FC<{ user: User | null, isReadOnly: boolean, targetUser?: User}> = ({ user, isReadOnly, targetUser }) => {
        // Handle null user case
        if (!user) {
            return (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-300 text-white font-bold text-md flex-shrink-0">
                        ?
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 leading-tight">Đang tải...</p>
                        <p className="text-xs text-slate-500 leading-tight">Vui lòng đợi</p>
                    </div>
                </div>
            );
        }

        const colorIndex = user.id.charCodeAt(1) % userColors.length;
        const roleLabels: { [key in User['role']]: string } = {
            admin: 'Giám Đốc',
            manager: 'Quản lý',
            marketing_lead: 'Trưởng phòng Marketing',
            member: 'Thành viên',
        };

        const fullNames: { [key: string]: string } = {
            'SH': 'Sếp Hạnh',
            'MH': 'Mr Hùng',
            'MN': 'Ms Nhung',
            'NI': 'Ninh',
        };

        return (
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-md flex-shrink-0 ${userColors[colorIndex]}`}>
                    {getInitials(fullNames[user.name] || user.name)}
                </div>
                <div>
                    <p className="font-bold text-slate-800 leading-tight">{fullNames[user.name] || user.name}</p>
                    <p className="text-xs text-slate-500 leading-tight">
                        {isReadOnly && targetUser ? `Đang xem việc của ${fullNames[targetUser.name] || targetUser.name}` : roleLabels[user.role]}
                    </p>
                </div>
            </div>
        )
    }

    // Show user selection if no user is selected
    if (!selectedUser) {
        return (
            <ErrorBoundary>
                <UserSelection onUserSelect={handleUserSelect} />
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary>
            <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
                {/* Liquid Glass Background Effect - Fixed */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-100/30 to-purple-100/30 backdrop-blur-3xl pointer-events-none"></div>
                <div className="absolute top-20 left-10 w-72 h-72 md:w-96 md:h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-40 right-10 w-80 h-80 md:w-[500px] md:h-[500px] bg-purple-300/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[600px] md:h-[600px] bg-pink-200/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Error Display */}
                {error && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg backdrop-blur-xl">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-red-800 mb-1">Lỗi kết nối</h3>
                                    <p className="text-sm text-red-700">{error}</p>
                                    <button
                                        onClick={() => {
                                            api.clearError();
                                            api.refreshTasks();
                                        }}
                                        className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                                <button
                                    onClick={() => api.clearError()}
                                    className="text-red-400 hover:text-red-600"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Container - Responsive & Scrollable */}
                <div className="relative z-10 flex flex-col h-full w-full max-w-md md:max-w-3xl lg:max-w-7xl mx-auto">
                {/* --- Header (iOS style - Large Title) --- */}
                <header className="px-4 md:px-6 lg:px-8 py-3 md:py-4 flex-shrink-0">
                    {/* Large Title */}
                    <h1 className="text-[34px] md:text-[42px] lg:text-[48px] font-bold tracking-tight mb-1 text-black">
                        {currentUser?.name || 'Công việc'}
                    </h1>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-500 text-[13px] md:text-[15px]">
                            {loading ? 'Đang tải...' : `${filteredTasks.length} công việc`}
                        </p>
                        <div className="flex items-center gap-1 md:gap-2">
                            {/* Refresh button */}
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                title="Đồng bộ với PostgreSQL"
                                className="p-2 md:p-3 text-[#007AFF] hover:bg-white/40 rounded-full backdrop-blur-xl transition-all active:scale-95 disabled:opacity-50"
                            >
                                <svg className={`w-5 h-5 md:w-6 md:h-6 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>

                            {!isReadOnly && (
                                <button onClick={() => setIsModalOpen(true)} title="Thêm công việc mới" className="p-2 md:p-3 text-[#007AFF] hover:bg-white/40 rounded-full backdrop-blur-xl transition-all active:scale-95">
                                    <PlusIcon />
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setCurrentUser(null);
                                    setSelectedUser(null);
                                    localStorage.removeItem('currentUser');
                                    localStorage.removeItem('selectedUser');
                                }}
                                title="Chuyển người dùng"
                                className="p-2 md:p-3 text-[#007AFF] hover:bg-white/40 rounded-full backdrop-blur-xl transition-all active:scale-95"
                            >
                                <ArrowLeftOnRectangleIcon/>
                            </button>
                        </div>
                    </div>
                </header>

                {/* --- Error Bar Only --- */}
                {error && (
                    <div className="px-4 md:px-6 lg:px-8 py-2 flex-shrink-0">
                        <div className="flex items-center gap-2 text-red-600 text-sm md:text-base bg-red-50/90 backdrop-blur-xl rounded-lg p-3 md:p-4 border border-red-200">
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                            <button onClick={api.clearError} className="text-red-500 hover:text-red-700 ml-auto">×</button>
                        </div>
                    </div>
                )}

                {/* --- Filter Pills (Horizontal scroll) --- */}
                <FilterPills
                    selectedDepartment={selectedDepartment}
                    selectedStatus={selectedStatus}
                    selectedPriority={selectedPriority}
                    onDepartmentChange={setSelectedDepartment}
                    onStatusChange={setSelectedStatus}
                    onPriorityChange={setSelectedPriority}
                    departmentCounts={departmentCounts}
                    statusCounts={statusCounts}
                    priorityCounts={priorityCounts}
                    totalTasks={filteredTasks.length}
                />

                {/* --- Task List with Sections --- */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden pb-32 md:pb-36 lg:pb-40 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {loading && tasks.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <LoadingSpinner message="Đang tải dữ liệu..." />
                        </div>
                    ) : (
                        <>
                            {/* New Tasks Section */}
                            {(() => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const yesterday = new Date(today);
                                yesterday.setDate(yesterday.getDate() - 1);

                                const newTasks = filteredTasks.filter(task => {
                                    const taskDate = new Date(task.createdAt);
                                    taskDate.setHours(0, 0, 0, 0);
                                    return taskDate >= yesterday;
                                });

                                const oldTasks = filteredTasks.filter(task => {
                                    const taskDate = new Date(task.createdAt);
                                    taskDate.setHours(0, 0, 0, 0);
                                    return taskDate < yesterday;
                                });

                                return (
                                    <>
                                        {newTasks.length > 0 && (
                                            <>
                                                <div className="px-3 md:px-6 lg:px-8 mb-2">
                                                    <h3 className="text-[13px] md:text-[15px] text-gray-500">Công việc mới</h3>
                                                </div>
                                                <div className="bg-white/30 backdrop-blur-xl rounded-[20px] mx-3 md:mx-6 lg:mx-8 overflow-hidden shadow-xl shadow-black/5 border border-white/40 mb-6">
                                                    <KanbanColumn
                                                        tasks={newTasks}
                                                        onSelectTask={handleSelectTask}
                                                        selectedTaskId={selectedTask?.id}
                                                        isSearchActive={searchQuery.length > 0}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {oldTasks.length > 0 && (
                                            <>
                                                <div className="px-3 md:px-6 lg:px-8 mb-2">
                                                    <h3 className="text-[13px] md:text-[15px] text-gray-500">Công việc cũ hơn</h3>
                                                </div>
                                                <div className="bg-white/30 backdrop-blur-xl rounded-[20px] mx-3 md:mx-6 lg:mx-8 overflow-hidden shadow-xl shadow-black/5 border border-white/40">
                                                    <KanbanColumn
                                                        tasks={oldTasks}
                                                        onSelectTask={handleSelectTask}
                                                        selectedTaskId={selectedTask?.id}
                                                        isSearchActive={searchQuery.length > 0}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </>
                    )}
                </div>

                {/* --- Bottom Bar (iOS 16 Liquid Glass style - Floating Elements) --- */}
                <div className="fixed bottom-0 left-0 right-0 pb-5 md:pb-6 pointer-events-none z-50">
                    <div className="max-w-md md:max-w-3xl lg:max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pointer-events-auto">
                        <div className="flex items-center justify-center gap-3 md:gap-4">
                            {/* Left: Filter Menu Button (Hamburger) - Liquid Glass */}
                            <button
                                onClick={() => setIsFilterModalOpen(true)}
                                className="w-[60px] h-[60px] md:w-16 md:h-16 rounded-full bg-white/30 backdrop-blur-3xl flex items-center justify-center active:scale-95 transition-all duration-200 shadow-2xl relative flex-shrink-0 border border-white/20"
                                style={{
                                    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                                }}
                            >
                                {/* Hamburger Icon - Dark for contrast */}
                                <div className="flex flex-col gap-[5px]">
                                    <div className="w-7 h-[3px] bg-gray-900 rounded-full"></div>
                                    <div className="w-7 h-[3px] bg-gray-900 rounded-full"></div>
                                    <div className="w-7 h-[3px] bg-gray-900 rounded-full"></div>
                                </div>

                                {/* Active indicator - Green dot */}
                                {(selectedStatus || selectedPriority) && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#34C759] rounded-full border-2 border-white shadow-lg"></span>
                                )}
                            </button>

                            {/* Center: Search Bar - Liquid Glass */}
                            <div
                                className="flex-1 max-w-[500px] h-[60px] md:h-[64px] bg-white/30 backdrop-blur-3xl rounded-full flex items-center px-6 md:px-7 gap-3 shadow-2xl border border-white/20"
                                style={{
                                    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                                }}
                            >
                                {/* Search Icon */}
                                <svg className="w-6 h-6 md:w-7 md:h-7 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>

                                {/* Input */}
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-0 text-[17px] md:text-[18px] text-gray-900 font-semibold placeholder:text-gray-500 placeholder:font-normal focus:outline-none"
                                    style={{ fontSize: '17px' }}
                                />
                            </div>

                            {/* Right: Compose Button - Liquid Glass */}
                            {!isReadOnly && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-[60px] h-[60px] md:w-16 md:h-16 rounded-full bg-white/30 backdrop-blur-3xl flex items-center justify-center active:scale-95 transition-all duration-200 shadow-2xl flex-shrink-0 border border-white/20"
                                    style={{
                                        boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                                    }}
                                >
                                    {/* Pen/Edit Icon - Dark */}
                                    <svg className="w-7 h-7 md:w-8 md:h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                </div>

                {/* Modals */}
                {!isReadOnly && <AddTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddTask={handleAddTask}
                />}

                <TaskDetailModal
                    task={selectedTask}
                    isOpen={!!selectedTask}
                    onClose={handleCloseDetail}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    isReadOnly={isReadOnly}
                    selectedUser={selectedUser}
                    users={users}
                    api={api}
                />

                <FilterModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    selectedStatus={selectedStatus as TaskStatus | ''}
                    selectedPriority={selectedPriority as any}
                    onStatusChange={(status) => {
                        setSelectedStatus(status);
                        setSelectedDepartment('');
                    }}
                    onPriorityChange={(priority) => {
                        setSelectedPriority(priority);
                        setSelectedDepartment('');
                    }}
                    statusCounts={statusCounts}
                    priorityCounts={priorityCounts}
                />

                {/* Custom Styles */}
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
        </ErrorBoundary>
    );
};

export default App;