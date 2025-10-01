// Enhanced App component with Google Sheets integration
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, TaskStatus, User } from './types';
import KanbanColumn from './components/KanbanColumn';
import AddTaskModal from './components/AddTaskModal';
import UserSelection from './components/UserSelection';
import ErrorBoundary from './components/ErrorBoundary';
import { ArrowLeftOnRectangleIcon, PlusIcon, MagnifyingGlassIcon } from './components/icons';
import TaskDetailModal from './components/TaskDetailModal';
import FilterMenu from './components/FilterMenu';
import LoadingSpinner from './components/LoadingSpinner';
import { useGoogleSheets } from './hooks/useGoogleSheets';

// Moved to FilterMenu.tsx and TaskDetail.tsx

// --- Sample Data ---
const users: User[] = [
    { id: 'u1', name: 'Sếp Hạnh', role: 'admin' },
    { id: 'u2', name: 'Mr Hùng', role: 'manager' },
    { id: 'u3', name: 'Ms Nhung', role: 'marketing_lead' },
    { id: 'u4', name: 'Ninh', role: 'member' },
];

interface SelectedUser {
    id: string
    name: string
    role: string
    avatar: string
    color: string
}

const NINH_USER_ID = 'u4'; // NI user

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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedPriority, setSelectedPriority] = useState<string>('');

    // Google Sheets integration
    const { tasks, loading, error, isOnline, lastSync, actions, isConfigured } = useGoogleSheets();

    // Load user from localStorage - only run once on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        const savedSelectedUser = localStorage.getItem('selectedUser');

        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setCurrentUser(user);
                // Set current user in Google Sheets service when loading from localStorage
                // Use setTimeout to ensure actions is available after initial render
                setTimeout(() => {
                    actions.setCurrentUser(user.id);
                }, 0);
                console.log(`🔄 Restored user from localStorage: ${user.name} (${user.id})`);
            } catch (error) {
                console.error('Error loading user:', error);
            }
        }

        if (savedSelectedUser) {
            try {
                setSelectedUser(JSON.parse(savedSelectedUser));
            } catch (error) {
                console.error('Error loading selected user:', error);
            }
        }
    }, []); // Empty dependency array - only run once on mount

    // Handle user selection from UserSelection component
    const handleUserSelect = (user: SelectedUser) => {
        setSelectedUser(user);
        localStorage.setItem('selectedUser', JSON.stringify(user));

        // Map selected user to current user for existing logic
        const mappedUser = users.find(u => u.name === user.name);
        if (mappedUser) {
            setCurrentUser(mappedUser);
            localStorage.setItem('currentUser', JSON.stringify(mappedUser));

            // CRITICAL FIX: Set current user in Google Sheets service for user-specific data
            actions.setCurrentUser(mappedUser.id);
            console.log(`🔄 User switched to: ${mappedUser.name} (${mappedUser.id})`);
        }
    };

    // Clear selections when user changes
    useEffect(() => {
        if (currentUser) {
            setSelectedTask(null);
            setSearchQuery('');
        }
    }, [currentUser]);

    // Role-based permissions: Only restrict certain actions for specific roles
    // For now, allow all users to comment and interact
    const isReadOnly = false; // currentUser?.role === 'viewer'; // Uncomment if you want viewer-only role

    const handleAddTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'subtasks'>) => {
        if (isReadOnly) return;

        try {
            await actions.addTask({
                ...taskData,
                subtasks: [],
                comments: taskData.comments || [],
                createdBy: currentUser?.id, // Set task creator for permission system
            });
            console.log('✅ Task added successfully');
        } catch (error) {
            console.error('❌ Failed to add task:', error);
        }
    }, [isReadOnly, actions, currentUser?.id]);

    const handleSelectTask = useCallback((task: Task) => {
        setSelectedTask(task);
        // Mark task as read when selected (Gmail-style)
        if (!task.isRead) {
            const updatedTask = { ...task, isRead: true };
            // Update without setting selectedTask to avoid re-opening modal
            actions.updateTask(updatedTask).catch(error => {
                console.error('❌ Failed to mark task as read:', error);
            });
        }
    }, [actions]);

    const handleCloseDetail = useCallback(() => {
        setSelectedTask(null);
    }, []);

    const handleUpdateTask = useCallback(async (updatedTask: Task) => {
        if (isReadOnly) return;

        try {
            // Optimistic update: Update UI immediately
            setSelectedTask(updatedTask);

            // Sync with backend in background
            await actions.updateTask(updatedTask);
            console.log('✅ Task updated successfully');
        } catch (error) {
            console.error('❌ Failed to update task:', error);
            // Revert on error (optional: could show error toast)
        }
    }, [isReadOnly, actions]);

    const handleDeleteTask = useCallback(async (taskId: string) => {
        if (isReadOnly) return;

        try {
            await actions.deleteTask(taskId);
            setSelectedTask(null);
            console.log('✅ Task deleted successfully');
        } catch (error) {
            console.error('❌ Failed to delete task:', error);
        }
    }, [isReadOnly, actions]);

    const handleRefresh = useCallback(async () => {
        console.log('🔄 Refresh button clicked');
        try {
            console.log('📊 Current tasks count:', tasks.length);
            await actions.refreshTasks();
            console.log('✅ Tasks refreshed from Google Sheets');
            console.log('📊 New tasks count:', tasks.length);
        } catch (error) {
            console.error('❌ Failed to refresh:', error);
        }
    }, [tasks.length, actions]);

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
            <div className="h-screen w-screen overflow-hidden animate-app-fade-in">
            <div className="flex h-full w-full">
                {/* --- Sidebar (Task List) --- */}
                <aside className={`
                    absolute md:relative w-full md:w-96 h-full bg-slate-50/70 backdrop-blur-2xl border-r border-slate-300/50
                    flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out
                    ${selectedTask ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
                `}>
                     <header className="p-4 border-b border-slate-300/50 flex justify-between items-center flex-shrink-0">
                        <UserProfileHeader user={currentUser} isReadOnly={isReadOnly} targetUser={userForHeader} />
                        <div className="flex items-center gap-1">
                            {/* Refresh button */}
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                title="Đồng bộ với Google Sheets"
                                className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-500/10 transition-colors disabled:opacity-50"
                            >
                                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>

                            {!isReadOnly && (
                                <button onClick={() => setIsModalOpen(true)} title="Thêm công việc mới" className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-500/10 transition-colors">
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
                                className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-500/10 transition-colors"
                            >
                                <ArrowLeftOnRectangleIcon/>
                            </button>
                        </div>
                    </header>

                    {/* --- Error Bar Only --- */}
                    {error && (
                        <div className="px-4 py-2 border-b border-slate-300/50 flex-shrink-0">
                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                                <button onClick={actions.clearError} className="text-red-500 hover:text-red-700">×</button>
                            </div>
                        </div>
                    )}

                    {/* --- Search Bar with Filter Menu --- */}
                    <div className="p-4 border-b border-slate-300/50 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            {/* Filter Menu - Moved to left */}
                            <FilterMenu
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
                            <div className="relative flex-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm công việc..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg border-0 bg-slate-200/60 py-2.5 pl-10 pr-4 text-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filters - Hidden, now using FilterMenu */}

                    <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain webkit-overflow-scrolling-touch min-h-0">
                        {loading && tasks.length === 0 ? (
                            <div className="flex items-center justify-center h-64">
                                <LoadingSpinner message="Đang tải dữ liệu từ Google Sheets..." />
                            </div>
                        ) : (
                            <div className="pb-24 md:pb-8 px-4">
                                <KanbanColumn
                                    tasks={filteredTasks}
                                    onSelectTask={handleSelectTask}
                                    selectedTaskId={selectedTask?.id}
                                    isSearchActive={searchQuery.length > 0}
                                />
                            </div>
                        )}
                    </div>
                </aside>

                {/* --- Main Content (Welcome Screen) --- */}
                <main className="hidden md:flex flex-1 flex-col items-center justify-center h-full text-center text-slate-500 p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h2 className="text-2xl font-semibold mt-6 text-slate-600">Bắt đầu làm việc</h2>
                    <p className="mt-2 max-w-sm">Chọn một công việc từ danh sách để xem chi tiết trong modal.</p>
                </main>
            </div>
            {!isReadOnly && <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddTask={handleAddTask}
            />}

            {/* Mobile Task Detail Modal */}
            <TaskDetailModal
                task={selectedTask}
                isOpen={!!selectedTask}
                onClose={handleCloseDetail}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                isReadOnly={isReadOnly}
                selectedUser={selectedUser}
            />
            </div>
        </ErrorBoundary>
    );
};

export default App;