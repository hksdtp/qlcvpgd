import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskStatus, Subtask, SelectOption, User, Comment, DEPARTMENTS, DEPARTMENT_COLORS } from '../types';

// Professional SVG Icons for TaskDetail
const TaskDetailIcons = {
    Calendar: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
    ),
    CheckCircle: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    ),
    Plus: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
    ),
    Chat: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
    ),
    Heart: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
    ),
    Edit: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
    ),
    EditTask: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
    ),
    Send: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
    ),
    Trash: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 112 0v4a1 1 0 11-2 0V9zm4 0a1 1 0 112 0v4a1 1 0 11-2 0V9z" clipRule="evenodd" />
        </svg>
    ),
    Check: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    ),
    Close: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
    )
};

// Status colors for badges

const STATUS_COLORS: { [key: string]: string } = {
    'Chưa làm': 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
    'Đang làm': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    'Lên Kế Hoạch': 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
    'Đang Review': 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
    'Hoàn thành': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    'Tạm dừng': 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
    'Hủy bỏ': 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
};
import { ChevronLeftIcon, TrashIcon, CheckIcon, PlusIcon } from './icons';
import { useVietnameseInput } from '../hooks/useVietnameseInput';
import { useDebounce } from '../hooks/useDebounce';
import { formatDateTime } from '../utils/dateUtils';

interface SelectedUser {
    id: string
    name: string
    role: string
    avatar: string
    color: string
}

interface TaskDetailProps {
    task: Task;
    onClose: () => void;
    onUpdate: (task: Task) => void;
    onDelete: (taskId: string) => void;
    isReadOnly: boolean;
    selectedUser?: SelectedUser;
    isMobileModal?: boolean;
}

// Mock users for demo
const mockUsers: User[] = [
    { id: '1', name: 'Nguyễn Văn A', role: 'admin' },
    { id: '2', name: 'Trần Thị B', role: 'manager' },
    { id: '3', name: 'Lê Văn C', role: 'marketing_lead' },
    { id: '4', name: 'Phạm Thị D', role: 'member' },
];

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

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose, onUpdate, onDelete, isReadOnly, selectedUser, isMobileModal }) => {
    const [editedTask, setEditedTask] = useState<Task>(task);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [newComment, setNewComment] = useState('');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [isEditingTask, setIsEditingTask] = useState(false);

    // Refs for mobile keyboard handling
    const subtaskInputRef = useRef<HTMLInputElement>(null);
    const commentInputRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Vietnamese input support
    const subtaskInput = useVietnameseInput({
        value: newSubtaskTitle,
        onChange: setNewSubtaskTitle,
        onKeyDown: (e) => e.key === 'Enter' && handleAddSubtask()
    });

    const commentInput = useVietnameseInput({
        value: newComment,
        onChange: setNewComment,
        onKeyDown: (e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAddComment())
    });

    const editCommentInput = useVietnameseInput({
        value: editingCommentContent,
        onChange: setEditingCommentContent
    });

    const titleInput = useVietnameseInput({
        value: editedTask.title,
        onChange: (value) => handleInputChange('title', value)
    });

    const descriptionInput = useVietnameseInput({
        value: editedTask.description,
        onChange: (value) => handleInputChange('description', value)
    });

    // Debounced update to prevent multiple rapid calls
    const debouncedUpdate = useDebounce((task: Task) => {
        onUpdate(task);
    }, 500); // 500ms delay

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.status-dropdown') && !target.closest('.department-dropdown')) {
                setShowStatusDropdown(false);
                setShowDepartmentDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setEditedTask(task);
    }, [task]);

    // Mobile keyboard handling
    useEffect(() => {
        const handleResize = () => {
            // Detect if keyboard is open on mobile
            const isMobile = window.innerWidth <= 768;
            const isKeyboardOpen = window.visualViewport && window.visualViewport.height < window.innerHeight * 0.75;

            if (isMobile && isKeyboardOpen) {
                // Add padding to prevent content from being hidden
                if (containerRef.current) {
                    containerRef.current.style.paddingBottom = '300px';
                }
            } else {
                // Reset padding when keyboard closes
                if (containerRef.current) {
                    containerRef.current.style.paddingBottom = '80px';
                }
            }
        };

        // Listen for viewport changes (keyboard open/close)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
        }

        // Fallback for older browsers
        window.addEventListener('resize', handleResize);

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Auto-scroll to input when focused
    const handleInputFocus = (inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>) => {
        setTimeout(() => {
            if (inputRef.current && containerRef.current) {
                const inputRect = inputRef.current.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();

                // Check if input is below the visible area
                if (inputRect.bottom > window.innerHeight - 100) {
                    inputRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    });
                }
            }
        }, 300); // Delay to allow keyboard animation
    };

    const handleInputChange = (field: 'title' | 'description', value: string) => {
        const updatedTask = { ...editedTask, [field]: value };
        setEditedTask(updatedTask);
        // Use debounced update for text changes
        debouncedUpdate(updatedTask);
    };

    const handleSelectChange = (field: 'status' | 'department', value: string) => {
        setEditedTask(prev => ({...prev, [field]: value}));
    };

    const handleSubtaskToggle = (subtaskId: string) => {
        const now = new Date().toISOString();
        const updatedSubtasks = editedTask.subtasks.map(subtask => {
            if (subtask.id === subtaskId) {
                const newCompleted = !subtask.completed;
                return {
                    ...subtask,
                    completed: newCompleted,
                    completedAt: newCompleted ? now : undefined
                };
            }
            return subtask;
        });
        const updatedTask = { ...editedTask, subtasks: updatedSubtasks };
        setEditedTask(updatedTask);

        // Auto-save to Google Sheets
        onUpdate(updatedTask);
    };
    
    const handleAddSubtask = () => {
        if (!newSubtaskTitle.trim() || isReadOnly) return;
        const now = new Date().toISOString();
        const newSubtask: Subtask = {
            id: `s-${Date.now()}`,
            title: newSubtaskTitle.trim(),
            completed: false,
            createdAt: now,
        };
        const updatedTask = {...editedTask, subtasks: [...editedTask.subtasks, newSubtask]};
        setEditedTask(updatedTask);
        setNewSubtaskTitle('');

        // Auto-save to Google Sheets
        onUpdate(updatedTask);
    };

    const handleDeleteSubtask = (subtaskId: string) => {
        if (isReadOnly) return;
        const updatedSubtasks = editedTask.subtasks.filter(subtask => subtask.id !== subtaskId);
        const updatedTask = { ...editedTask, subtasks: updatedSubtasks };
        setEditedTask(updatedTask);

        // Auto-save to Google Sheets
        onUpdate(updatedTask);
    };

    const handleAddComment = () => {
        console.log('🔧 Comment Debug:');
        console.log('- newComment:', newComment.trim());
        console.log('- isReadOnly:', isReadOnly);
        console.log('- selectedUser:', selectedUser);
        console.log('- selectedUser.id:', selectedUser?.id);
        console.log('- selectedUser.name:', selectedUser?.name);

        if (!newComment.trim()) {
            console.log('❌ Comment blocked: Empty comment');
            return;
        }

        if (isReadOnly) {
            console.log('❌ Comment blocked: Read only mode');
            return;
        }

        if (!selectedUser) {
            console.log('❌ Comment blocked: No selected user');
            return;
        }

        console.log('✅ Adding comment...');

        const now = new Date().toISOString();
        const comment: Comment = {
            id: `c-${Date.now()}`,
            content: newComment.trim(),
            author: { id: selectedUser.id, name: selectedUser.name, role: selectedUser.role as any },
            createdAt: now,
            likes: 0,
            likedBy: [],
            isEdited: false
        };

        console.log('📝 New comment:', comment);

        const updatedTask = {...editedTask, comments: [...(editedTask.comments || []), comment]};
        setEditedTask(updatedTask);
        setNewComment('');

        console.log('💾 Saving comment to backend...');
        // Auto-save comments immediately when Send button is clicked
        onUpdate(updatedTask);
    };

    const handleEditComment = (commentId: string, currentContent: string) => {
        setEditingCommentId(commentId);
        setEditingCommentContent(currentContent);
    };

    const handleSaveEditComment = () => {
        if (!editingCommentContent.trim() || !editingCommentId) return;

        const now = new Date().toISOString();
        const updatedComments = editedTask.comments.map(comment =>
            comment.id === editingCommentId
                ? { ...comment, content: editingCommentContent.trim(), updatedAt: now, isEdited: true }
                : comment
        );
        const updatedTask = { ...editedTask, comments: updatedComments };
        setEditedTask(updatedTask);
        setEditingCommentId(null);
        setEditingCommentContent('');

        // Auto-save edited comments
        onUpdate(updatedTask);
    };

    const handleCancelEditComment = () => {
        setEditingCommentId(null);
        setEditingCommentContent('');
    };

    const handleDeleteComment = (commentId: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;

        const updatedComments = editedTask.comments.filter(comment => comment.id !== commentId);
        const updatedTask = { ...editedTask, comments: updatedComments };
        setEditedTask(updatedTask);

        // Auto-save after deleting comment
        onUpdate(updatedTask);
    };

    const handleLikeComment = (commentId: string) => {
        if (!selectedUser) return;

        const updatedComments = editedTask.comments.map(comment => {
            if (comment.id === commentId) {
                const isLiked = comment.likedBy.includes(selectedUser.id);
                const newLikedBy = isLiked
                    ? comment.likedBy.filter(id => id !== selectedUser.id)
                    : [...comment.likedBy, selectedUser.id];

                return {
                    ...comment,
                    likes: newLikedBy.length,
                    likedBy: newLikedBy
                };
            }
            return comment;
        });

        const updatedTask = { ...editedTask, comments: updatedComments };
        setEditedTask(updatedTask);

        // Auto-save like/unlike
        onUpdate(updatedTask);
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSaveChanges = () => {
        if (isReadOnly) return;
        onUpdate(editedTask);
    };
    
    const hasChanges = JSON.stringify(task) !== JSON.stringify(editedTask);
    const completedSubtasks = editedTask.subtasks.filter(st => st.completed).length;
    const totalSubtasks = editedTask.subtasks.length;

    return (
        <div ref={containerRef} className="h-full flex flex-col max-h-full p-4 md:p-8 overflow-y-auto" style={{ scrollPaddingTop: '100px' }}>
            {/* Task Title Section - Only show when not in modal */}
            {!isMobileModal && (
                <header className="flex justify-between items-start flex-shrink-0 mb-6 md:mb-8">
                    <div className="flex items-center gap-2 flex-grow min-w-0">
                        <input
                            type="text"
                            {...titleInput}
                            className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 bg-transparent focus:outline-none focus:bg-slate-200/50 rounded-lg p-1 -m-1 w-full truncate disabled:bg-transparent disabled:cursor-default"
                            readOnly={isReadOnly}
                            lang="vi"
                            autoComplete="off"
                            spellCheck="true"
                        />
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 pl-2">
                        {!isReadOnly && hasChanges && (
                            <button onClick={handleSaveChanges} className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors flex items-center gap-2 pl-3 pr-4 text-sm font-semibold shadow-lg shadow-indigo-500/30">
                                <TaskDetailIcons.Check /> <span>Lưu</span>
                            </button>
                        )}
                        {!isReadOnly && (
                           <button onClick={() => { if(window.confirm('Bạn có chắc muốn xóa công việc này?')) onDelete(task.id) }} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-500/10 transition-colors">
                               <TaskDetailIcons.Trash />
                           </button>
                        )}
                    </div>
                </header>
            )}


            
            <div className="flex-grow overflow-y-auto overflow-x-hidden">
                {/* Department - Status - Actions in One Line */}
                <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                    {/* Left side: Department and Status */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Department */}
                        <div className="department-dropdown relative">
                            <button
                                onClick={() => !isReadOnly && isEditingTask && setShowDepartmentDropdown(!showDepartmentDropdown)}
                                disabled={isReadOnly || !isEditingTask}
                                className={`px-3 py-2 rounded-lg border font-medium text-sm transition-all duration-200 ${
                                    DEPARTMENT_COLORS[editedTask.department || 'CV Chung'] || 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                                } ${(!isReadOnly && isEditingTask) ? 'cursor-pointer hover:scale-105 hover:shadow-sm' : 'cursor-default'}`}
                            >
                                {editedTask.department || 'CV Chung'}
                                {(!isReadOnly && isEditingTask) && (
                                    <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </button>

                            {/* Department Dropdown */}
                            {showDepartmentDropdown && !isReadOnly && isEditingTask && (
                                <div className="absolute z-10 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2">
                                    {departmentOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                handleSelectChange('department', option.value);
                                                setShowDepartmentDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                                                editedTask.department === option.value ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                                            }`}
                                        >
                                            <span className={`inline-block px-2 py-1 rounded-lg border text-xs mr-2 ${
                                                DEPARTMENT_COLORS[option.value] || 'bg-gray-100 text-gray-800 border-gray-200'
                                            }`}>
                                                {option.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div className="status-dropdown relative">
                            <button
                                onClick={() => !isReadOnly && isEditingTask && setShowStatusDropdown(!showStatusDropdown)}
                                disabled={isReadOnly || !isEditingTask}
                                className={`px-3 py-2 rounded-lg border font-medium text-sm transition-all duration-200 ${
                                    STATUS_COLORS[editedTask.status] || 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                                } ${(!isReadOnly && isEditingTask) ? 'cursor-pointer hover:scale-105 hover:shadow-sm' : 'cursor-default'}`}
                            >
                                {editedTask.status}
                                {(!isReadOnly && isEditingTask) && (
                                    <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </button>

                            {/* Status Dropdown */}
                            {showStatusDropdown && !isReadOnly && isEditingTask && (
                                <div className="absolute z-10 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2">
                                    {statusOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                handleSelectChange('status', option.value);
                                                setShowStatusDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                                                editedTask.status === option.value ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                                            }`}
                                        >
                                            <span className={`inline-block px-2 py-1 rounded-lg border text-xs mr-2 ${
                                                STATUS_COLORS[option.value] || 'bg-gray-100 text-gray-800 border-gray-200'
                                            }`}>
                                                {option.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side: Action Buttons */}
                    <div className="flex items-center gap-2">
                        {!isReadOnly && hasChanges && (
                            <button
                                onClick={handleSaveChanges}
                                className="px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shadow-sm ios-button macos-hover no-zoom"
                            >
                                <TaskDetailIcons.Check />
                                <span className="hidden sm:inline">Lưu</span>
                            </button>
                        )}
                        {!isReadOnly && (
                            <button
                                onClick={() => setIsEditingTask(!isEditingTask)}
                                className={`p-2 rounded-lg transition-colors flex items-center text-sm font-medium shadow-sm ios-button macos-hover no-zoom ${
                                    isEditingTask
                                        ? 'text-white bg-blue-600 hover:bg-blue-700'
                                        : 'text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200'
                                }`}
                                title={isEditingTask ? 'Xong' : 'Sửa'}
                            >
                                <TaskDetailIcons.EditTask />
                            </button>
                        )}
                        {!isReadOnly && (
                           <button
                               onClick={() => {
                                   if(window.confirm('Bạn có chắc muốn xóa công việc này?')) onDelete(task.id)
                               }}
                               className="p-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center text-sm font-medium shadow-sm ios-button macos-hover no-zoom"
                               title="Xóa"
                           >
                               <TaskDetailIcons.Trash />
                           </button>
                        )}
                    </div>
                </div>


                {/* Description Section */}
                <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-sm">
                    <div className="mb-3">
                        <label htmlFor="description" className="text-sm font-medium text-slate-700">Mô tả</label>
                    </div>
                    <textarea
                      id="description"
                      rows={4}
                      {...descriptionInput}
                      placeholder={isReadOnly ? "Không có mô tả" : "Thêm mô tả chi tiết..."}
                      className={`text-slate-700 whitespace-pre-wrap leading-relaxed p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                          (isReadOnly || !isEditingTask)
                              ? 'bg-slate-50 border border-slate-200 cursor-default opacity-75'
                              : 'bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-indigo-500'
                      }`}
                      readOnly={isReadOnly || !isEditingTask}
                      lang="vi"
                      autoComplete="off"
                      spellCheck="true"
                    />
                </div>

                <div className="mt-8">
                    <h3 className="font-semibold text-slate-800 mb-4">Tiến độ công việc ({completedSubtasks}/{totalSubtasks})</h3>
                    <ul className="space-y-3">
                        {editedTask.subtasks.map(subtask => (
                            <li key={subtask.id} className="p-3 bg-slate-200/40 rounded-lg group">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`subtask-${subtask.id}`}
                                        checked={subtask.completed}
                                        onChange={() => handleSubtaskToggle(subtask.id)}
                                        className="custom-checkbox h-4 w-4 text-indigo-600 flex-shrink-0 disabled:cursor-not-allowed"
                                        disabled={isReadOnly}
                                    />
                                    <div className="ml-3 flex-grow">
                                        <label htmlFor={`subtask-${subtask.id}`} className={`text-md text-slate-800 select-none ${isReadOnly ? '' : 'cursor-pointer'} transition-colors ${subtask.completed ? 'line-through text-slate-500' : ''}`}>
                                            {subtask.title}
                                        </label>
                                        <div className="flex items-center gap-4 mt-1 text-xs">
                                            <span className="text-slate-500 flex items-center gap-1">
                                                <TaskDetailIcons.Calendar />
                                                Tạo: {formatDateTime(subtask.createdAt || new Date().toISOString())}
                                            </span>
                                            {subtask.completed && subtask.completedAt && (
                                                <span className="text-green-600 font-medium flex items-center gap-1">
                                                    <TaskDetailIcons.CheckCircle />
                                                    Hoàn thành: {formatDateTime(subtask.completedAt)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {!isReadOnly && (
                                        <button onClick={() => handleDeleteSubtask(subtask.id)} className="ml-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <TaskDetailIcons.Trash />
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                     {!isReadOnly && (
                        <div className="mt-4 inline-input-container">
                            <input
                                ref={subtaskInputRef}
                                type="text"
                                {...subtaskInput}
                                onFocus={() => handleInputFocus(subtaskInputRef)}
                                placeholder="Thêm tiến độ mới..."
                                className="w-full input-with-inline-button pl-3 py-2 border border-slate-300/70 rounded-lg bg-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 input-focus focus-ring no-zoom"
                                style={{ fontSize: '16px' }}
                                lang="vi"
                                autoComplete="off"
                                spellCheck="true"
                            />
                            <button
                                onClick={handleAddSubtask}
                                className="inline-input-button text-indigo-600 hover:text-white hover:bg-indigo-600 ios-button macos-hover no-zoom"
                                title="Thêm tiến độ"
                                disabled={!subtaskInput.value.trim()}
                            >
                                <TaskDetailIcons.Plus />
                            </button>
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                <div className="mt-8">
                    <h3 className="font-semibold text-slate-800 mb-4">Bình luận ({(editedTask.comments || []).length})</h3>

                    {/* Existing Comments */}
                    <div className="space-y-3 mb-4">
                        {(editedTask.comments || []).map(comment => (
                            <div key={comment.id} className="p-3 bg-blue-50/50 rounded-lg border-l-4 border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-700">{comment.author.name}</span>
                                        <span className="text-xs text-slate-500">
                                            {formatDateTime(comment.createdAt)}
                                            {comment.isEdited && <span className="ml-1">(đã chỉnh sửa)</span>}
                                        </span>
                                    </div>
                                    {!isReadOnly && selectedUser && comment.author.id === selectedUser.id && (
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEditComment(comment.id, comment.content)}
                                                className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <TaskDetailIcons.Edit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                                                title="Xóa"
                                            >
                                                <TaskDetailIcons.Trash />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {editingCommentId === comment.id ? (
                                    <div className="space-y-2">
                                        <textarea
                                            {...editCommentInput}
                                            className="w-full px-3 py-2 border border-slate-300/70 rounded-lg bg-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            rows={2}
                                            lang="vi"
                                            autoComplete="off"
                                            spellCheck="true"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSaveEditComment}
                                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                            >
                                                Lưu
                                            </button>
                                            <button
                                                onClick={handleCancelEditComment}
                                                className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-slate-600 mb-2">{comment.content}</p>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleLikeComment(comment.id)}
                                                className={`flex items-center gap-1 text-xs transition-colors ${
                                                    selectedUser && comment.likedBy.includes(selectedUser.id)
                                                        ? 'text-red-600 hover:text-red-700'
                                                        : 'text-slate-400 hover:text-red-600'
                                                }`}
                                                disabled={!selectedUser}
                                            >
                                                <TaskDetailIcons.Heart />
                                                <span>{comment.likes}</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add New Comment */}
                    {!isReadOnly && (
                        <div className="relative">
                            <textarea
                                ref={commentInputRef}
                                {...commentInput}
                                onFocus={() => handleInputFocus(commentInputRef)}
                                placeholder="Thêm bình luận..."
                                rows={3}
                                className="w-full textarea-with-inline-button pl-3 pt-3 border border-slate-300/70 rounded-lg bg-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none input-focus focus-ring no-zoom"
                                style={{ fontSize: '16px', minHeight: '80px' }}
                                lang="vi"
                                autoComplete="off"
                                spellCheck="true"
                            />
                            <button
                                onClick={handleAddComment}
                                className="inline-textarea-button text-blue-600 hover:text-white hover:bg-blue-600 ios-button macos-hover no-zoom"
                                title="Gửi bình luận"
                                disabled={!commentInput.value.trim()}
                            >
                                <TaskDetailIcons.Send />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;