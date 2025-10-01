import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskStatus, TaskPriority, Subtask, SelectOption, User, Comment, DEPARTMENTS, DEPARTMENT_COLORS, STATUS_COLORS, PRIORITY_COLORS } from '../types';
import { DepartmentIcons, DepartmentIconsSolid, PriorityIcons, PriorityIconsSolid, StatusIcons, StatusIconsSolid } from './IconLibrary';

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

// Status colors imported from types.ts for consistency
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
    { value: TaskStatus.OnHold, label: TaskStatus.OnHold },
    { value: TaskStatus.Paused, label: TaskStatus.Paused },
];

const departmentOptions: SelectOption[] = DEPARTMENTS.map(dept => ({
    value: dept,
    label: dept
}));

const priorityOptions: SelectOption[] = [
    { value: TaskPriority.High, label: TaskPriority.High },
    { value: TaskPriority.Medium, label: TaskPriority.Medium },
    { value: TaskPriority.Low, label: TaskPriority.Low },
];

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose, onUpdate, onDelete, isReadOnly, selectedUser, isMobileModal }) => {
    const [editedTask, setEditedTask] = useState<Task>(task);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [newComment, setNewComment] = useState('');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Permission system: Allow all team members to edit tasks for collaboration
    const isTaskOwner = selectedUser && task.createdBy === selectedUser.id;
    const canEditTask = !isReadOnly; // Allow all users to edit for team collaboration
    const canDeleteTask = !isReadOnly && isTaskOwner; // Only owner can delete

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
            if (!target.closest('.status-dropdown') && !target.closest('.department-dropdown') && !target.closest('.priority-dropdown')) {
                setShowStatusDropdown(false);
                setShowDepartmentDropdown(false);
                setShowPriorityDropdown(false);
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

    const handleSelectChange = (field: 'status' | 'department' | 'priority', value: string) => {
        const updatedTask = {...editedTask, [field]: value};
        setEditedTask(updatedTask);

        // Immediately sync status changes to Google Sheets
        if (field === 'status') {
            console.log(`🔄 Status changed from "${editedTask.status}" to "${value}"`);
            onUpdate(updatedTask);
        } else {
            // For other fields, use debounced update
            debouncedUpdate(updatedTask);
        }
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
        if (!newSubtaskTitle.trim() || !canEditTask) return;
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
        if (!canEditTask) return;
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

    const handleSaveChanges = async () => {
        if (!canEditTask || isSaving) return;

        setIsSaving(true);
        try {
            await onUpdate(editedTask);
            // Exit edit mode after successful save
            setIsEditingTask(false);
        } catch (error) {
            console.error('Failed to save changes:', error);
            // Keep edit mode on error so user can retry
        } finally {
            setIsSaving(false);
        }
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
                            readOnly={!canEditTask}
                            lang="vi"
                            autoComplete="off"
                            spellCheck="true"
                        />
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 pl-2">
                        {canEditTask && hasChanges && (
                            <button
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed rounded-full transition-all duration-200 flex items-center gap-2 pl-3 pr-4 text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Đang lưu...</span>
                                    </>
                                ) : (
                                    <>
                                        <TaskDetailIcons.Check /> <span>Lưu</span>
                                    </>
                                )}
                            </button>
                        )}
                        {canDeleteTask && (
                           <button onClick={() => { if(window.confirm('Bạn có chắc muốn xóa công việc này?')) onDelete(task.id) }} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-500/10 transition-colors">
                               <TaskDetailIcons.Trash />
                           </button>
                        )}
                    </div>
                </header>
            )}


            
            <div className="flex-grow overflow-y-auto overflow-x-hidden">
                {/* Department - Status - Actions in One Line - REDESIGNED */}
                <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                    {/* Left side: Department, Status, and Priority */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Department - Modern Design */}
                        <div className="department-dropdown relative">
                            <button
                                onClick={() => !isReadOnly && isEditingTask && setShowDepartmentDropdown(!showDepartmentDropdown)}
                                disabled={isReadOnly || !isEditingTask}
                                className={`
                                    px-4 py-2.5 rounded-xl font-semibold text-sm
                                    transition-all duration-200
                                    ${(!isReadOnly && isEditingTask)
                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-2 border-blue-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
                                        : 'bg-slate-100 text-slate-600 border-2 border-slate-200 cursor-default'
                                    }
                                `}
                            >
                                <span className="flex items-center gap-2">
                                    {DepartmentIcons[editedTask.department || 'CV Chung']?.({ className: "w-4 h-4" })}
                                    {editedTask.department || 'CV Chung'}
                                    {(!isReadOnly && isEditingTask) && (
                                        <svg className={`w-4 h-4 transition-transform duration-200 ${showDepartmentDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </span>
                            </button>

                            {/* Department Dropdown - Modern Design */}
                            {showDepartmentDropdown && !isReadOnly && isEditingTask && (
                                <div className="absolute z-50 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden animate-dropdown-open">
                                    <div className="max-h-80 overflow-y-auto">
                                        {departmentOptions.map((option, index) => {
                                            const isSelected = editedTask.department === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        handleSelectChange('department', option.value);
                                                        setShowDepartmentDropdown(false);
                                                    }}
                                                    className={`
                                                        w-full flex items-center justify-between gap-3 px-4 py-3.5
                                                        transition-all duration-150
                                                        ${isSelected
                                                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-500'
                                                            : 'text-slate-700 hover:bg-slate-50 border-l-4 border-transparent'
                                                        }
                                                        ${index !== 0 ? 'border-t border-slate-100' : ''}
                                                    `}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                            isSelected ? 'bg-blue-100' : 'bg-slate-100'
                                                        }`}>
                                                            {isSelected
                                                                ? DepartmentIconsSolid[option.value]?.({ className: "w-4 h-4" })
                                                                : DepartmentIcons[option.value]?.({ className: "w-4 h-4" })
                                                            }
                                                        </div>
                                                        <span className="font-semibold">{option.label}</span>
                                                    </span>
                                                    {isSelected && (
                                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Priority - Modern Design */}
                        <div className="priority-dropdown relative">
                            <button
                                onClick={() => canEditTask && isEditingTask && setShowPriorityDropdown(!showPriorityDropdown)}
                                disabled={!canEditTask || !isEditingTask}
                                className={`
                                    px-4 py-2.5 rounded-xl font-bold text-sm
                                    transition-all duration-200
                                    ${(canEditTask && isEditingTask)
                                        ? editedTask.priority === 'CAO'
                                            ? 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-2 border-red-200 hover:border-red-300 hover:shadow-md cursor-pointer'
                                            : editedTask.priority === 'TRUNG BÌNH'
                                            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-2 border-yellow-200 hover:border-yellow-300 hover:shadow-md cursor-pointer'
                                            : 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-2 border-green-200 hover:border-green-300 hover:shadow-md cursor-pointer'
                                        : 'bg-slate-100 text-slate-600 border-2 border-slate-200 cursor-default'
                                    }
                                `}
                            >
                                <span className="flex items-center gap-2">
                                    {PriorityIcons[editedTask.priority || 'TRUNG BÌNH']?.({ className: "w-4 h-4" })}
                                    {editedTask.priority || 'TRUNG BÌNH'}
                                    {(canEditTask && isEditingTask) && (
                                        <svg className={`w-4 h-4 transition-transform duration-200 ${showPriorityDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </span>
                            </button>

                            {/* Priority Dropdown - Modern Design */}
                            {showPriorityDropdown && (canEditTask && isEditingTask) && (
                                <div className="absolute z-50 mt-2 w-56 bg-white rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden animate-dropdown-open">
                                    <div className="max-h-80 overflow-y-auto">
                                        {priorityOptions.map((option, index) => {
                                            const isSelected = editedTask.priority === option.value;
                                            const priorityStyles = {
                                                'CAO': {
                                                    bg: isSelected ? 'bg-gradient-to-r from-red-50 to-rose-50' : '',
                                                    text: isSelected ? 'text-red-700' : 'text-slate-700',
                                                    border: isSelected ? 'border-l-4 border-red-500' : 'border-l-4 border-transparent',
                                                    iconBg: isSelected ? 'bg-red-100' : 'bg-slate-100',
                                                    dot: 'bg-red-500'
                                                },
                                                'TRUNG BÌNH': {
                                                    bg: isSelected ? 'bg-gradient-to-r from-yellow-50 to-amber-50' : '',
                                                    text: isSelected ? 'text-yellow-700' : 'text-slate-700',
                                                    border: isSelected ? 'border-l-4 border-yellow-500' : 'border-l-4 border-transparent',
                                                    iconBg: isSelected ? 'bg-yellow-100' : 'bg-slate-100',
                                                    dot: 'bg-yellow-500'
                                                },
                                                'THẤP': {
                                                    bg: isSelected ? 'bg-gradient-to-r from-green-50 to-emerald-50' : '',
                                                    text: isSelected ? 'text-green-700' : 'text-slate-700',
                                                    border: isSelected ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent',
                                                    iconBg: isSelected ? 'bg-green-100' : 'bg-slate-100',
                                                    dot: 'bg-green-500'
                                                }
                                            };
                                            const style = priorityStyles[option.value as keyof typeof priorityStyles];

                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        handleSelectChange('priority', option.value);
                                                        setShowPriorityDropdown(false);
                                                    }}
                                                    className={`
                                                        w-full flex items-center justify-between gap-3 px-4 py-3.5
                                                        transition-all duration-150
                                                        ${isSelected ? `${style.bg} ${style.text} ${style.border}` : `${style.text} hover:bg-slate-50 ${style.border}`}
                                                        ${index !== 0 ? 'border-t border-slate-100' : ''}
                                                    `}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.iconBg}`}>
                                                            {isSelected
                                                                ? PriorityIconsSolid[option.value]?.({ className: "w-5 h-5" })
                                                                : PriorityIcons[option.value]?.({ className: "w-5 h-5" })
                                                            }
                                                        </div>
                                                        <span className="font-bold">{option.label}</span>
                                                    </span>
                                                    {isSelected && (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Status - Modern Design */}
                        <div className="status-dropdown relative">
                            <button
                                onClick={() => !isReadOnly && isEditingTask && setShowStatusDropdown(!showStatusDropdown)}
                                disabled={isReadOnly || !isEditingTask}
                                className={`
                                    px-4 py-2.5 rounded-xl font-semibold text-sm
                                    transition-all duration-200
                                    ${(!isReadOnly && isEditingTask)
                                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-2 border-green-200 hover:border-green-300 hover:shadow-md cursor-pointer'
                                        : 'bg-slate-100 text-slate-600 border-2 border-slate-200 cursor-default'
                                    }
                                `}
                            >
                                <span className="flex items-center gap-2">
                                    {StatusIcons[editedTask.status]?.({ className: "w-4 h-4" })}
                                    {editedTask.status}
                                    {(!isReadOnly && isEditingTask) && (
                                        <svg className={`w-4 h-4 transition-transform duration-200 ${showStatusDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </span>
                            </button>

                            {/* Status Dropdown - Modern Design */}
                            {showStatusDropdown && !isReadOnly && isEditingTask && (
                                <div className="absolute z-50 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden animate-dropdown-open">
                                    <div className="max-h-80 overflow-y-auto">
                                        {statusOptions.map((option, index) => {
                                            const isSelected = editedTask.status === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        handleSelectChange('status', option.value);
                                                        setShowStatusDropdown(false);
                                                    }}
                                                    className={`
                                                        w-full flex items-center justify-between gap-3 px-4 py-3.5
                                                        transition-all duration-150
                                                        ${isSelected
                                                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-l-4 border-green-500'
                                                            : 'text-slate-700 hover:bg-slate-50 border-l-4 border-transparent'
                                                        }
                                                        ${index !== 0 ? 'border-t border-slate-100' : ''}
                                                    `}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                            isSelected ? 'bg-green-100' : 'bg-slate-100'
                                                        }`}>
                                                            {isSelected
                                                                ? StatusIconsSolid[option.value]?.({ className: "w-4 h-4" })
                                                                : StatusIcons[option.value]?.({ className: "w-4 h-4" })
                                                            }
                                                        </div>
                                                        <span className="font-semibold">{option.label}</span>
                                                    </span>
                                                    {isSelected && (
                                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side: Action Buttons */}
                    <div className="flex items-center gap-2">
                        {canEditTask && hasChanges && (
                            <button
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className="px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm ios-button macos-hover no-zoom hover:scale-105 active:scale-95"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="hidden sm:inline">Đang lưu...</span>
                                    </>
                                ) : (
                                    <>
                                        <TaskDetailIcons.Check />
                                        <span className="hidden sm:inline">Lưu</span>
                                    </>
                                )}
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
                      className={`text-slate-700 whitespace-pre-wrap leading-relaxed p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 no-zoom ${
                          (isReadOnly || !isEditingTask)
                              ? 'bg-slate-50 border border-slate-200 cursor-default opacity-75'
                              : 'bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-indigo-500'
                      }`}
                      style={{ fontSize: '16px', WebkitAppearance: 'none', WebkitTextSizeAdjust: '100%', transform: 'translateZ(0)' }}
                      readOnly={isReadOnly || !isEditingTask}
                      lang="vi"
                      autoComplete="off"
                      spellCheck="true"
                    />
                </div>

                <div className="mt-8">
                    <h3 className="font-semibold text-slate-800 mb-4">Tiến độ công việc ({completedSubtasks}/{totalSubtasks})</h3>
                    <ul className="space-y-2">
                        {editedTask.subtasks.map(subtask => (
                            <li key={subtask.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-100/50 hover:border-slate-200 transition-all duration-200 group">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`subtask-${subtask.id}`}
                                        checked={subtask.completed}
                                        onChange={() => handleSubtaskToggle(subtask.id)}
                                        className="custom-checkbox h-4 w-4 text-indigo-600 flex-shrink-0 disabled:cursor-not-allowed rounded"
                                        disabled={!canEditTask}
                                    />
                                    <div className="ml-3 flex-grow">
                                        <label htmlFor={`subtask-${subtask.id}`} className={`text-sm font-medium text-slate-800 select-none ${isReadOnly ? '' : 'cursor-pointer'} transition-colors ${subtask.completed ? 'line-through text-slate-500' : ''}`}>
                                            {subtask.title}
                                        </label>
                                        <div className="flex items-center gap-4 mt-1 text-xs">
                                            <span className="text-slate-400 flex items-center gap-1">
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
                                    {canEditTask && (
                                        <button onClick={() => handleDeleteSubtask(subtask.id)} className="ml-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200">
                                            <TaskDetailIcons.Trash />
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                     {canEditTask && (
                        <div className="mt-4 inline-input-container">
                            <input
                                ref={subtaskInputRef}
                                type="text"
                                {...subtaskInput}
                                onFocus={() => handleInputFocus(subtaskInputRef)}
                                placeholder="Thêm tiến độ mới..."
                                className="compact-subtask-input input-with-inline-button w-full"
                                style={{ fontSize: '16px', WebkitAppearance: 'none', WebkitTextSizeAdjust: '100%', transform: 'translateZ(0)' }}
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
                    <h3 className="font-semibold text-slate-800 mb-6">Bình luận ({(editedTask.comments || []).length})</h3>

                    {/* Existing Comments */}
                    <div className="mb-6">
                        {(editedTask.comments || []).map(comment => (
                            <div key={comment.id} className="modern-comment">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="comment-author">{comment.author.name}</div>
                                        <div className="comment-content">{comment.content}</div>
                                        <div className="comment-meta">
                                            <span className="comment-timestamp">
                                                {formatDateTime(comment.createdAt)}
                                                {comment.isEdited && <span className="ml-1">(đã chỉnh sửa)</span>}
                                            </span>
                                            <button
                                                onClick={() => handleLikeComment(comment.id)}
                                                className={`comment-action ${
                                                    selectedUser && comment.likedBy.includes(selectedUser.id) ? 'liked' : ''
                                                }`}
                                                disabled={!selectedUser}
                                            >
                                                <TaskDetailIcons.Heart />
                                                <span>{comment.likes}</span>
                                            </button>
                                        </div>
                                    </div>
                                    {!isReadOnly && selectedUser && comment.author.id === selectedUser.id && (
                                        <div className="flex items-center gap-1 ml-4">
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

                                {editingCommentId === comment.id && (
                                    <div className="edit-comment-form">
                                        <textarea
                                            {...editCommentInput}
                                            className="edit-comment-textarea"
                                            rows={2}
                                            lang="vi"
                                            autoComplete="off"
                                            spellCheck="true"
                                            placeholder="Chỉnh sửa bình luận..."
                                        />
                                        <div className="edit-comment-actions">
                                            <button
                                                onClick={handleCancelEditComment}
                                                className="modern-button-secondary"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                onClick={handleSaveEditComment}
                                                className="modern-button"
                                            >
                                                Lưu
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add New Comment - All users can comment */}
                    {!isReadOnly && selectedUser && (
                        <div className="relative">
                            <textarea
                                ref={commentInputRef}
                                {...commentInput}
                                onFocus={() => handleInputFocus(commentInputRef)}
                                placeholder="Viết bình luận..."
                                rows={3}
                                className="modern-comment-input textarea-with-inline-button w-full"
                                style={{ fontSize: '16px', minHeight: '80px', WebkitAppearance: 'none', WebkitTextSizeAdjust: '100%', transform: 'translateZ(0)' }}
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

// Add CSS animation for dropdown
const style = document.createElement('style');
style.textContent = `
    @keyframes dropdown-open {
        from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    .animate-dropdown-open {
        animation: dropdown-open 0.15s ease-out forwards;
    }
`;
if (typeof document !== 'undefined' && !document.getElementById('task-detail-dropdown-styles')) {
    style.id = 'task-detail-dropdown-styles';
    document.head.appendChild(style);
}

export default TaskDetail;