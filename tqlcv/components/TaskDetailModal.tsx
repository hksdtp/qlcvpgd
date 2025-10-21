import React, { useState } from 'react';
import { Task, User, TaskStatus, TaskPriority, DEPARTMENTS } from '../types';
import { Calendar, Tag, Flag, Save, Circle, CheckCircle2, Send, Heart, Reply, Paperclip, Download, X } from 'lucide-react';
import { PRIORITY_COLORS, STATUS_COLORS, DEPARTMENT_COLORS } from '../types';
import { getStatusColor, getPriorityColor, getDepartmentColor } from '../constants/filterColors';
import { StatusPicker } from './StatusPicker';
import { PriorityPicker } from './PriorityPicker';
import { DatePicker } from './DatePicker';

// Custom SVG Icons
const EditIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const DeleteIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const CloseIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

interface TaskDetailModalProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (task: Task) => void;
    onDelete: (taskId: string) => void;
    isReadOnly: boolean;
    selectedUser: User | null;
    users: User[];
    api: any; // API methods from useAPI hook
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
    task,
    isOpen,
    onClose,
    onUpdate,
    onDelete,
    isReadOnly,
    selectedUser,
    users,
    api
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState<Task | null>(task);
    const [newSubtask, setNewSubtask] = useState("");
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editCommentText, setEditCommentText] = useState("");
    const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
    const [editSubtaskText, setEditSubtaskText] = useState("");
    const [attachments, setAttachments] = useState<any[]>([]);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const [statusButtonRef, setStatusButtonRef] = useState<HTMLElement | null>(null);
    const [priorityButtonRef, setPriorityButtonRef] = useState<HTMLElement | null>(null);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showDueDatePicker, setShowDueDatePicker] = useState(false);
    const [startDateButtonRef, setStartDateButtonRef] = useState<HTMLElement | null>(null);
    const [dueDateButtonRef, setDueDateButtonRef] = useState<HTMLElement | null>(null);

    // Helper function to format date
    const formatDisplayDate = (dateStr: string | null | undefined): string => {
        if (!dateStr) return 'Chọn ngày';

        // Parse ISO format (YYYY-MM-DD)
        const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) {
            const day = isoMatch[3];
            const month = isoMatch[2];
            const year = isoMatch[1];
            return `${day}/${month}/${year}`;
        }

        return dateStr;
    };

    // Update editedTask when task prop changes (e.g., after adding comment)
    React.useEffect(() => {
        if (task) {
            setEditedTask(task);
        }
    }, [task]);

    // Load attachments when task changes
    React.useEffect(() => {
        if (task && isOpen) {
            loadAttachments();
        }
    }, [task?.id, isOpen]);

    const loadAttachments = async () => {
        if (!task) return;
        try {
            const data = await api.getAttachments(task.id);
            setAttachments(data);
        } catch (error) {
            console.error('Error loading attachments:', error);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !task || !selectedUser) return;

        setUploadingFile(true);
        try {
            await api.uploadAttachment(task.id, file, selectedUser.id);
            await loadAttachments();
            event.target.value = ''; // Reset input
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Lỗi khi upload file!');
        } finally {
            setUploadingFile(false);
        }
    };

    const handleDeleteAttachment = async (attachmentId: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa file này?')) return;

        try {
            await api.deleteAttachment(attachmentId);
            await loadAttachments();
        } catch (error) {
            console.error('Error deleting attachment:', error);
            alert('Lỗi khi xóa file!');
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (!isOpen || !task) return null;

    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
    const totalSubtasks = task.subtasks.length;
    const canEdit = !isReadOnly && selectedUser;

    const handleSave = () => {
        if (editedTask) {
            onUpdate(editedTask);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditedTask(task);
        setIsEditing(false);
    };

    const handleUpdateField = async (field: string, value: any) => {
        if (!task || isReadOnly) return;
        try {
            await api.updateTask(task.id, { [field]: value });
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    };

    const handleSubtaskToggle = async (subtaskId: string) => {
        if (!canEdit) return;
        try {
            await api.toggleSubtask(task.id, subtaskId);
        } catch (error) {
            console.error('Error toggling subtask:', error);
        }
    };

    // Main Task Detail Modal - All-in-One View
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-md"
                onClick={onClose}
            ></div>

            {/* Modal Container - Responsive Width */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 flex-1 pr-4">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedTask?.title || ''}
                                    onChange={(e) => setEditedTask(editedTask ? { ...editedTask, title: e.target.value } : null)}
                                    className="w-full bg-white/50 border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                    placeholder="Tên công việc"
                                />
                            ) : (
                                task.title
                            )}
                        </h2>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {canEdit && !isEditing && (
                                <>
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-9 h-9 flex items-center justify-center hover:bg-blue-100 rounded-lg transition-colors group"
                                        title="Chỉnh sửa công việc"
                                    >
                                        <EditIcon className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
                                                onDelete(task.id);
                                                onClose();
                                            }
                                        }}
                                        className="w-9 h-9 flex items-center justify-center hover:bg-red-100 rounded-lg transition-colors group"
                                        title="Xóa công việc"
                                    >
                                        <DeleteIcon className="w-5 h-5 text-red-600 group-hover:text-red-700" />
                                    </button>
                                </>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={isEditing ? handleCancel : onClose}
                                className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors group"
                                title={isEditing ? "Hủy chỉnh sửa" : "Đóng"}
                            >
                                <CloseIcon className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status & Priority Badges - Horizontal Layout */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Status Badge */}
                        <button
                            ref={(el) => setStatusButtonRef(el)}
                            onClick={(e) => {
                                if (!isReadOnly) {
                                    setStatusButtonRef(e.currentTarget);
                                    setShowStatusModal(true);
                                }
                            }}
                            disabled={isReadOnly}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                ${getStatusColor(task.status).bgActive} ${getStatusColor(task.status).textActive}
                                ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-lg hover:scale-105'}
                            `}
                        >
                            <Flag className="w-4 h-4" />
                            <span>{task.status}</span>
                        </button>

                        {/* Priority Badge */}
                        <button
                            ref={(el) => setPriorityButtonRef(el)}
                            onClick={(e) => {
                                if (!isReadOnly) {
                                    setPriorityButtonRef(e.currentTarget);
                                    setShowPriorityModal(true);
                                }
                            }}
                            disabled={isReadOnly}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                ${getPriorityColor(task.priority || TaskPriority.Medium).bgActive} ${getPriorityColor(task.priority || TaskPriority.Medium).textActive}
                                ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-lg hover:scale-105'}
                            `}
                        >
                            <Flag className="w-4 h-4" />
                            <span>{task.priority || TaskPriority.Medium}</span>
                        </button>

                        {/* Department Badge (read-only) */}
                        {task.department && (
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getDepartmentColor(task.department).bgActive} ${getDepartmentColor(task.department).textActive}`}>
                                <Tag className="w-4 h-4" />
                                <span>{task.department}</span>
                            </div>
                        )}
                    </div>

                    {/* Date Pickers Row */}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        {/* Start Date Button */}
                        <button
                            ref={(el) => setStartDateButtonRef(el)}
                            onClick={(e) => {
                                if (!isReadOnly) {
                                    setStartDateButtonRef(e.currentTarget);
                                    setShowStartDatePicker(true);
                                }
                            }}
                            disabled={isReadOnly}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                bg-green-100 text-green-700
                                ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-lg hover:scale-105'}
                            `}
                        >
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs text-green-600 mr-1">Ngày bắt đầu:</span>
                            <span>{formatDisplayDate(task.startDate)}</span>
                        </button>

                        {/* Due Date Button */}
                        <button
                            ref={(el) => setDueDateButtonRef(el)}
                            onClick={(e) => {
                                if (!isReadOnly) {
                                    setDueDateButtonRef(e.currentTarget);
                                    setShowDueDatePicker(true);
                                }
                            }}
                            disabled={isReadOnly}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                bg-orange-100 text-orange-700
                                ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-lg hover:scale-105'}
                            `}
                        >
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs text-orange-600 mr-1">Ngày deadline:</span>
                            <span>{formatDisplayDate(task.dueDate)}</span>
                        </button>
                    </div>
                </div>

                {/* Modal Content - Scrollable */}
                <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6 py-4 space-y-4">
                    {/* Description Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Chi Tiết Công Việc</h3>
                        {isEditing ? (
                            <textarea
                                value={editedTask?.description || ''}
                                onChange={(e) => setEditedTask(editedTask ? { ...editedTask, description: e.target.value } : null)}
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-700"
                                rows={4}
                                placeholder="Mô tả công việc..."
                            />
                        ) : (
                            <p className="text-gray-700 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                                {task.description || 'Chưa có mô tả'}
                            </p>
                        )}
                    </div>

                    {/* Subtasks Section - Always Visible */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                        {/* Progress Bar */}
                        {totalSubtasks > 0 && (
                            <div className="px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Tiến độ</span>
                                    <span className="text-sm font-semibold text-gray-600">
                                        {completedSubtasks}/{totalSubtasks}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                                        style={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Subtasks List */}
                        <div className="max-h-64 overflow-y-auto">
                            {task.subtasks.length > 0 ? (
                                task.subtasks.map((subtask, index) => (
                                    <div
                                        key={subtask.id}
                                        className={`px-4 py-3 ${
                                            index < task.subtasks.length - 1 ? 'border-b border-gray-200/50' : ''
                                        } transition-colors`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Circle/CheckCircle Icon */}
                                            <div
                                                onClick={() => handleSubtaskToggle(subtask.id)}
                                                className={`${canEdit ? 'cursor-pointer' : ''}`}
                                            >
                                                {subtask.completed ? (
                                                    <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                                ) : (
                                                    <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                                                )}
                                            </div>

                                            {/* Subtask Content */}
                                            <div className="flex-1 min-w-0">
                                                {editingSubtaskId === subtask.id ? (
                                                    <input
                                                        type="text"
                                                        value={editSubtaskText}
                                                        onChange={(e) => setEditSubtaskText(e.target.value)}
                                                        onKeyPress={async (e) => {
                                                            if (e.key === 'Enter' && editSubtaskText.trim()) {
                                                                try {
                                                                    await api.updateSubtask(task.id, subtask.id, { title: editSubtaskText.trim() });
                                                                    setEditingSubtaskId(null);
                                                                    setEditSubtaskText("");
                                                                } catch (error) {
                                                                    console.error('Error updating subtask:', error);
                                                                }
                                                            } else if (e.key === 'Escape') {
                                                                setEditingSubtaskId(null);
                                                                setEditSubtaskText("");
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            setEditingSubtaskId(null);
                                                            setEditSubtaskText("");
                                                        }}
                                                        className="w-full bg-white border border-blue-300 rounded px-2 py-1 text-sm text-gray-700 outline-none focus:border-blue-500"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <>
                                                        <span className={`text-sm ${
                                                            subtask.completed
                                                                ? 'text-gray-400 line-through'
                                                                : 'text-gray-700'
                                                        }`}>
                                                            {subtask.title}
                                                        </span>

                                                        {/* Timestamp */}
                                                        <div className="text-[11px] text-gray-500 mt-0.5">
                                                            {subtask.completed && subtask.completedAt ? (
                                                                <span>Hoàn thành {new Date(subtask.completedAt).toLocaleString('vi-VN', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}</span>
                                                            ) : subtask.createdAt ? (
                                                                <span>Tạo {new Date(subtask.createdAt).toLocaleString('vi-VN', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}</span>
                                                            ) : null}
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Edit/Delete buttons */}
                                            {canEdit && editingSubtaskId !== subtask.id && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingSubtaskId(subtask.id);
                                                            setEditSubtaskText(subtask.title);
                                                        }}
                                                        className="text-xs text-gray-500 hover:text-blue-600"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm('Bạn có chắc muốn xóa công việc con này?')) {
                                                                try {
                                                                    await api.deleteSubtask(task.id, subtask.id);
                                                                } catch (error) {
                                                                    console.error('Error deleting subtask:', error);
                                                                }
                                                            }
                                                        }}
                                                        className="text-xs text-gray-500 hover:text-red-600"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                    Chưa có công việc con
                                </div>
                            )}
                        </div>

                        {/* Add New Subtask */}
                        {canEdit && (
                            <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200/50">
                                <input
                                    type="text"
                                    placeholder="Thêm công việc mới..."
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    onKeyPress={async (e) => {
                                        if (e.key === 'Enter' && newSubtask.trim()) {
                                            try {
                                                await api.addSubtask(task.id, {
                                                    title: newSubtask.trim(),
                                                    completed: false
                                                });
                                                setNewSubtask("");
                                            } catch (error) {
                                                console.error('Error adding subtask:', error);
                                            }
                                        }
                                    }}
                                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <button
                                    onClick={async () => {
                                        if (newSubtask.trim()) {
                                            try {
                                                await api.addSubtask(task.id, {
                                                    title: newSubtask.trim(),
                                                    completed: false
                                                });
                                                setNewSubtask("");
                                            } catch (error) {
                                                console.error('Error adding subtask:', error);
                                            }
                                        }
                                    }}
                                    disabled={!newSubtask.trim()}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                        newSubtask.trim()
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Attachments Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        <div className="px-4 py-3 border-b border-gray-200/50 bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Paperclip className="w-4 h-4" />
                                    File đính kèm ({attachments.length})
                                </h3>
                                {canEdit && (
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            disabled={uploadingFile}
                                            className="hidden"
                                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
                                        />
                                        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                            uploadingFile
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}>
                                            {uploadingFile ? 'Đang tải...' : '+ Thêm file'}
                                        </div>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Attachments List */}
                        <div className="max-h-64 overflow-y-auto">
                            {attachments.length > 0 ? (
                                <div className="divide-y divide-gray-200/50">
                                    {attachments.map((attachment) => (
                                        <div
                                            key={attachment.id}
                                            className="px-4 py-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* File Icon */}
                                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                    {attachment.fileType?.startsWith('image/') ? (
                                                        <img
                                                            src={attachment.filePath}
                                                            alt={attachment.fileName}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <Paperclip className="w-5 h-5 text-blue-600" />
                                                    )}
                                                </div>

                                                {/* File Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm text-gray-700 font-medium truncate">
                                                        {attachment.fileName}
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                                        <span>{formatFileSize(attachment.fileSize)}</span>
                                                        <span>•</span>
                                                        <span>{new Date(attachment.createdAt).toLocaleDateString('vi-VN')}</span>
                                                        {attachment.uploader && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{attachment.uploader.name}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={attachment.filePath}
                                                        download={attachment.fileName}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                                                        title="Tải xuống"
                                                    >
                                                        <Download className="w-4 h-4 text-gray-600" />
                                                    </a>
                                                    {canEdit && selectedUser && attachment.uploadedBy === selectedUser.id && (
                                                        <button
                                                            onClick={() => handleDeleteAttachment(attachment.id)}
                                                            className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                                                            title="Xóa"
                                                        >
                                                            <X className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                    Chưa có file đính kèm
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comments Section - Facebook Style */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        {/* Action Buttons - Like, Comment */}
                        <div className="border-b border-gray-200">
                            <div className="flex items-center justify-around py-1">
                                <button
                                    onClick={async () => {
                                        if (!selectedUser) return;
                                        console.log('🔍 Frontend - selectedUser:', selectedUser);
                                        console.log('🔍 Frontend - selectedUser.id:', selectedUser.id);
                                        // Toggle like cho task - call API
                                        const isLiked = task.likedBy?.includes(selectedUser.id);
                                        try {
                                            if (isLiked) {
                                                await api.unlikeTask(task.id, selectedUser.id);
                                            } else {
                                                await api.likeTask(task.id, selectedUser.id);
                                            }
                                        } catch (error) {
                                            console.error('Error toggling task like:', error);
                                        }
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-lg ${
                                        task.likedBy?.includes(selectedUser?.id || '') ? 'text-red-600' : 'text-gray-700'
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 ${task.likedBy?.includes(selectedUser?.id || '') ? 'fill-red-600 text-red-600' : 'text-gray-600'}`} />
                                    <span className="text-sm font-medium">Like</span>
                                    {task.likes && task.likes > 0 && (
                                        <span className="text-xs">({task.likes})</span>
                                    )}
                                </button>
                                <div className="w-px h-6 bg-gray-200"></div>
                                <button
                                    onClick={() => {
                                        // Focus vào comment input
                                        const commentInput = document.querySelector('input[placeholder="Viết comment..."]') as HTMLInputElement;
                                        if (commentInput) {
                                            commentInput.focus();
                                            commentInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-lg"
                                >
                                    <Reply className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">Comment</span>
                                </button>
                            </div>
                        </div>

                        {/* Likes List - Show who liked this task */}
                        {task.likedBy && task.likedBy.length > 0 && (
                            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                                <button
                                    onClick={() => setShowLikesModal(true)}
                                    className="text-xs text-gray-600 hover:underline flex items-center gap-1"
                                >
                                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                                    <span>
                                        {(() => {
                                            // Get names of users who liked
                                            const likedUsers = task.likedBy
                                                .map(userId => users?.find(u => u.id === userId)?.name || 'Unknown')
                                                .filter(name => name !== 'Unknown');

                                            if (likedUsers.length === 0) return 'Ai đó đã thích';
                                            if (likedUsers.length === 1) return `${likedUsers[0]} đã thích`;
                                            if (likedUsers.length === 2) return `${likedUsers[0]} và ${likedUsers[1]} đã thích`;
                                            if (likedUsers.length === 3) return `${likedUsers[0]}, ${likedUsers[1]} và ${likedUsers[2]} đã thích`;
                                            // All 4 users
                                            return `${likedUsers[0]}, ${likedUsers[1]}, ${likedUsers[2]} và ${likedUsers[3]} đã thích`;
                                        })()}
                                    </span>
                                </button>
                            </div>
                        )}

                        {/* Comments List */}
                        <div className="max-h-96 overflow-y-auto">
                            {task.comments && task.comments.length > 0 ? (
                                <div className="p-4 space-y-3">
                                    {/* Only show top-level comments (parentId === null) */}
                                    {task.comments.filter(c => !c.parentId).map((comment, index) => {
                                        const authorName = typeof comment.author === 'string'
                                            ? comment.author
                                            : comment.author?.name || 'Unknown';
                                        const authorInitial = authorName.charAt(0).toUpperCase();

                                        // Gradient colors for avatars (rotate through 4 colors)
                                        const avatarColors = [
                                            'bg-gradient-to-br from-blue-400 to-blue-600',
                                            'bg-gradient-to-br from-pink-400 to-pink-600',
                                            'bg-gradient-to-br from-purple-400 to-purple-600',
                                            'bg-gradient-to-br from-green-400 to-green-600'
                                        ];
                                        const avatarColor = avatarColors[index % 4];

                                        return (
                                            <div key={comment.id || index} className="flex gap-2">
                                                {/* Avatar */}
                                                <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                                    <span className="text-white text-xs font-semibold">{authorInitial}</span>
                                                </div>

                                                {/* Comment Content */}
                                                <div className="flex-1 min-w-0">
                                                    {/* Comment Bubble */}
                                                    {editingCommentId === comment.id ? (
                                                        <div className="bg-gray-100 rounded-2xl px-3 py-2 max-w-full">
                                                            <div className="text-sm font-semibold text-gray-900 mb-1">{authorName}</div>
                                                            <input
                                                                type="text"
                                                                value={editCommentText}
                                                                onChange={(e) => setEditCommentText(e.target.value)}
                                                                onKeyPress={async (e) => {
                                                                    if (e.key === 'Enter' && editCommentText.trim()) {
                                                                        try {
                                                                            await api.updateComment(comment.id, editCommentText.trim());
                                                                            setEditingCommentId(null);
                                                                            setEditCommentText("");
                                                                        } catch (error) {
                                                                            console.error('Error updating comment:', error);
                                                                        }
                                                                    } else if (e.key === 'Escape') {
                                                                        setEditingCommentId(null);
                                                                        setEditCommentText("");
                                                                    }
                                                                }}
                                                                className="w-full bg-white border border-blue-300 rounded px-2 py-1 text-sm text-gray-800 outline-none focus:border-blue-500"
                                                                autoFocus
                                                            />
                                                            <div className="flex gap-2 mt-2">
                                                                <button
                                                                    onClick={async () => {
                                                                        if (editCommentText.trim()) {
                                                                            try {
                                                                                await api.updateComment(comment.id, editCommentText.trim());
                                                                                setEditingCommentId(null);
                                                                                setEditCommentText("");
                                                                            } catch (error) {
                                                                                console.error('Error updating comment:', error);
                                                                            }
                                                                        }
                                                                    }}
                                                                    className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                                >
                                                                    Lưu
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingCommentId(null);
                                                                        setEditCommentText("");
                                                                    }}
                                                                    className="text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                                                >
                                                                    Hủy
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-gray-100 rounded-2xl px-3 py-2 inline-block max-w-full">
                                                            <div className="text-sm font-semibold text-gray-900">{authorName}</div>
                                                            <p className="text-sm text-gray-800 break-words">{comment.content}</p>
                                                        </div>
                                                    )}

                                                    {/* Action Links */}
                                                    <div className="flex items-center gap-3 mt-1 px-3">
                                                        <button
                                                            onClick={async () => {
                                                                if (!selectedUser) return;
                                                                const isLiked = comment.likedBy?.includes(selectedUser.id);
                                                                try {
                                                                    if (isLiked) {
                                                                        await api.unlikeComment(task.id, comment.id, selectedUser.id);
                                                                    } else {
                                                                        await api.likeComment(task.id, comment.id, selectedUser.id);
                                                                    }
                                                                } catch (error) {
                                                                    console.error('Error toggling comment like:', error);
                                                                }
                                                            }}
                                                            className={`text-xs font-semibold flex items-center gap-1 ${
                                                                comment.likedBy?.includes(selectedUser?.id || '')
                                                                    ? 'text-red-600'
                                                                    : 'text-gray-600 hover:underline'
                                                            }`}
                                                        >
                                                            <Heart className={`w-3 h-3 ${comment.likedBy?.includes(selectedUser?.id || '') ? 'fill-red-600' : ''}`} />
                                                            Like
                                                            {comment.likes > 0 && (
                                                                <span className="text-xs text-gray-600">({comment.likes})</span>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id || null)}
                                                            className="text-xs font-semibold text-gray-600 hover:underline"
                                                        >
                                                            Trả lời
                                                        </button>

                                                        {/* Edit/Delete buttons - only show for comment author */}
                                                        {selectedUser && comment.author &&
                                                         (typeof comment.author === 'object' ? comment.author.id === selectedUser.id : false) && (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingCommentId(comment.id);
                                                                        setEditCommentText(comment.content);
                                                                    }}
                                                                    className="text-xs font-semibold text-gray-600 hover:underline"
                                                                >
                                                                    Sửa
                                                                </button>
                                                                <button
                                                                    onClick={async () => {
                                                                        if (window.confirm('Bạn có chắc muốn xóa comment này?')) {
                                                                            try {
                                                                                await api.deleteComment(comment.id);
                                                                            } catch (error) {
                                                                                console.error('Error deleting comment:', error);
                                                                            }
                                                                        }
                                                                    }}
                                                                    className="text-xs font-semibold text-red-600 hover:underline"
                                                                >
                                                                    Xóa
                                                                </button>
                                                            </>
                                                        )}

                                                        <span className="text-xs text-gray-500 ml-auto">
                                                            {comment.createdAt ? (() => {
                                                                const now = new Date();
                                                                const created = new Date(comment.createdAt);
                                                                const diffMs = now.getTime() - created.getTime();
                                                                const diffMins = Math.floor(diffMs / 60000);
                                                                const diffHours = Math.floor(diffMins / 60);
                                                                const diffDays = Math.floor(diffHours / 24);

                                                                if (diffMins < 1) return 'Vừa xong';
                                                                if (diffMins < 60) return `${diffMins} phút`;
                                                                if (diffHours < 24) return `${diffHours} giờ`;
                                                                if (diffDays < 7) return `${diffDays} ngày`;
                                                                return created.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' });
                                                            })() : ''}
                                                            {comment.isEdited && ' (đã chỉnh sửa)'}
                                                        </span>
                                                    </div>

                                                    {/* Reply Input */}
                                                    {replyingTo === comment.id && canEdit && (
                                                        <div className="mt-2 ml-3 flex items-start gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                                                                <span className="text-white text-[10px] font-semibold">
                                                                    {selectedUser?.name?.charAt(0).toUpperCase() || 'U'}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
                                                                <input
                                                                    type="text"
                                                                    placeholder={`Trả lời ${authorName}...`}
                                                                    value={replyText}
                                                                    onChange={(e) => setReplyText(e.target.value)}
                                                                    onKeyPress={async (e) => {
                                                                        if (e.key === 'Enter' && replyText.trim() && selectedUser) {
                                                                            try {
                                                                                await api.addComment(task.id, {
                                                                                    content: replyText.trim(),
                                                                                    authorId: selectedUser.id,
                                                                                    parentId: comment.id
                                                                                });
                                                                                setReplyText("");
                                                                                setReplyingTo(null);
                                                                            } catch (error) {
                                                                                console.error('Error adding reply:', error);
                                                                            }
                                                                        }
                                                                    }}
                                                                    className="flex-1 bg-transparent text-xs text-gray-900 placeholder:text-gray-500 outline-none"
                                                                    autoFocus
                                                                />
                                                                {replyText.trim() && (
                                                                    <button
                                                                        onClick={async () => {
                                                                            if (replyText.trim() && selectedUser) {
                                                                                try {
                                                                                    await api.addComment(task.id, {
                                                                                        content: replyText.trim(),
                                                                                        authorId: selectedUser.id,
                                                                                        parentId: comment.id
                                                                                    });
                                                                                    setReplyText("");
                                                                                    setReplyingTo(null);
                                                                                } catch (error) {
                                                                                    console.error('Error adding reply:', error);
                                                                                }
                                                                            }
                                                                        }}
                                                                        className="text-blue-600 hover:text-blue-700"
                                                                    >
                                                                        <Send className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Replies (nested comments) */}
                                                    {task.comments?.filter(c => c.parentId === comment.id).map((reply, replyIndex) => {
                                                        const replyAuthorName = typeof reply.author === 'string'
                                                            ? reply.author
                                                            : reply.author?.name || 'Unknown';
                                                        const replyAuthorInitial = replyAuthorName.charAt(0).toUpperCase();
                                                        const replyAvatarColor = avatarColors[replyIndex % 4];

                                                        return (
                                                            <div key={reply.id || replyIndex} className="flex gap-2 mt-2 ml-3">
                                                                {/* Reply Avatar */}
                                                                <div className={`w-6 h-6 rounded-full ${replyAvatarColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                                                    <span className="text-white text-[10px] font-semibold">{replyAuthorInitial}</span>
                                                                </div>

                                                                {/* Reply Content */}
                                                                <div className="flex-1 min-w-0">
                                                                    {editingCommentId === reply.id ? (
                                                                        <div className="bg-gray-100 rounded-2xl px-3 py-1.5 max-w-full">
                                                                            <div className="text-xs font-semibold text-gray-900 mb-1">{replyAuthorName}</div>
                                                                            <input
                                                                                type="text"
                                                                                value={editCommentText}
                                                                                onChange={(e) => setEditCommentText(e.target.value)}
                                                                                onKeyPress={async (e) => {
                                                                                    if (e.key === 'Enter' && editCommentText.trim()) {
                                                                                        try {
                                                                                            await api.updateComment(reply.id, editCommentText.trim());
                                                                                            setEditingCommentId(null);
                                                                                            setEditCommentText("");
                                                                                        } catch (error) {
                                                                                            console.error('Error updating reply:', error);
                                                                                        }
                                                                                    } else if (e.key === 'Escape') {
                                                                                        setEditingCommentId(null);
                                                                                        setEditCommentText("");
                                                                                    }
                                                                                }}
                                                                                className="w-full bg-white border border-blue-300 rounded px-2 py-1 text-xs text-gray-800 outline-none focus:border-blue-500"
                                                                                autoFocus
                                                                            />
                                                                            <div className="flex gap-2 mt-1">
                                                                                <button
                                                                                    onClick={async () => {
                                                                                        if (editCommentText.trim()) {
                                                                                            try {
                                                                                                await api.updateComment(reply.id, editCommentText.trim());
                                                                                                setEditingCommentId(null);
                                                                                                setEditCommentText("");
                                                                                            } catch (error) {
                                                                                                console.error('Error updating reply:', error);
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    className="text-[10px] px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                                                >
                                                                                    Lưu
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setEditingCommentId(null);
                                                                                        setEditCommentText("");
                                                                                    }}
                                                                                    className="text-[10px] px-2 py-0.5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                                                                >
                                                                                    Hủy
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="bg-gray-100 rounded-2xl px-3 py-1.5 inline-block max-w-full">
                                                                            <div className="text-xs font-semibold text-gray-900">{replyAuthorName}</div>
                                                                            <p className="text-xs text-gray-800 break-words">{reply.content}</p>
                                                                        </div>
                                                                    )}

                                                                    {/* Reply Action Links */}
                                                                    <div className="flex items-center gap-3 mt-0.5 px-3">
                                                                        <button
                                                                            onClick={async () => {
                                                                                if (!selectedUser) return;
                                                                                const isLiked = reply.likedBy?.includes(selectedUser.id);
                                                                                try {
                                                                                    if (isLiked) {
                                                                                        await api.unlikeComment(task.id, reply.id, selectedUser.id);
                                                                                    } else {
                                                                                        await api.likeComment(task.id, reply.id, selectedUser.id);
                                                                                    }
                                                                                } catch (error) {
                                                                                    console.error('Error toggling reply like:', error);
                                                                                }
                                                                            }}
                                                                            className={`text-[11px] font-semibold flex items-center gap-1 ${
                                                                                reply.likedBy?.includes(selectedUser?.id || '')
                                                                                    ? 'text-red-600'
                                                                                    : 'text-gray-600 hover:underline'
                                                                            }`}
                                                                        >
                                                                            <Heart className={`w-2.5 h-2.5 ${reply.likedBy?.includes(selectedUser?.id || '') ? 'fill-red-600' : ''}`} />
                                                                            Like
                                                                            {reply.likes > 0 && (
                                                                                <span className="text-[11px] text-gray-600">({reply.likes})</span>
                                                                            )}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id || null)}
                                                                            className="text-[11px] font-semibold text-gray-600 hover:underline"
                                                                        >
                                                                            Trả lời
                                                                        </button>

                                                                        {/* Edit/Delete for reply author */}
                                                                        {selectedUser && reply.author &&
                                                                         (typeof reply.author === 'object' ? reply.author.id === selectedUser.id : false) && (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setEditingCommentId(reply.id);
                                                                                        setEditCommentText(reply.content);
                                                                                    }}
                                                                                    className="text-[11px] font-semibold text-gray-600 hover:underline"
                                                                                >
                                                                                    Sửa
                                                                                </button>
                                                                                <button
                                                                                    onClick={async () => {
                                                                                        if (window.confirm('Bạn có chắc muốn xóa reply này?')) {
                                                                                            try {
                                                                                                await api.deleteComment(reply.id);
                                                                                            } catch (error) {
                                                                                                console.error('Error deleting reply:', error);
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    className="text-[11px] font-semibold text-red-600 hover:underline"
                                                                                >
                                                                                    Xóa
                                                                                </button>
                                                                            </>
                                                                        )}

                                                                        <span className="text-[11px] text-gray-500 ml-auto">
                                                                            {reply.createdAt ? (() => {
                                                                                const now = new Date();
                                                                                const created = new Date(reply.createdAt);
                                                                                const diffMs = now.getTime() - created.getTime();
                                                                                const diffMins = Math.floor(diffMs / 60000);
                                                                                const diffHours = Math.floor(diffMins / 60);
                                                                                const diffDays = Math.floor(diffHours / 24);

                                                                                if (diffMins < 1) return 'Vừa xong';
                                                                                if (diffMins < 60) return `${diffMins} phút`;
                                                                                if (diffHours < 24) return `${diffHours} giờ`;
                                                                                if (diffDays < 7) return `${diffDays} ngày`;
                                                                                return created.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' });
                                                                            })() : ''}
                                                                            {reply.isEdited && ' (đã chỉnh sửa)'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="px-4 py-12 text-center text-gray-400 text-sm">
                                    Chưa có bình luận nào
                                </div>
                            )}
                        </div>

                        {/* Add Comment Input */}
                        {canEdit && (
                            <div className="border-t border-gray-200 px-4 py-3 bg-white">
                                <div className="flex items-start gap-2">
                                    {/* User Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <span className="text-white text-xs font-semibold">
                                            {selectedUser?.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>

                                    {/* Input Field */}
                                    <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                                        <input
                                            type="text"
                                            placeholder="Viết comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            onKeyPress={async (e) => {
                                                if (e.key === 'Enter' && newComment.trim() && selectedUser) {
                                                    console.log('🔍 Frontend - Add comment - selectedUser:', selectedUser);
                                                    console.log('🔍 Frontend - Add comment - selectedUser.id:', selectedUser.id);
                                                    try {
                                                        await api.addComment(task.id, {
                                                            content: newComment.trim(),
                                                            authorId: selectedUser.id
                                                        });
                                                        setNewComment("");
                                                    } catch (error) {
                                                        console.error('Error adding comment:', error);
                                                    }
                                                }
                                            }}
                                            className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-500 outline-none"
                                        />
                                        {newComment.trim() && (
                                            <button
                                                onClick={async () => {
                                                    if (newComment.trim() && selectedUser) {
                                                        try {
                                                            await api.addComment(task.id, {
                                                                content: newComment.trim(),
                                                                authorId: selectedUser.id
                                                            });
                                                            setNewComment("");
                                                        } catch (error) {
                                                            console.error('Error adding comment:', error);
                                                        }
                                                    }
                                                }}
                                                className="text-blue-600 hover:text-blue-700 active:scale-95 transition-all"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Save Button (when editing) */}
                    {isEditing && (
                        <div className="pt-2 border-t border-gray-200">
                            <button
                                onClick={handleSave}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-colors shadow-md"
                            >
                                <Save className="w-5 h-5" />
                                <span className="font-medium">Lưu thay đổi</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Likes Modal - Show who liked this task */}
            {showLikesModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLikesModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Người đã thích</h3>
                                <button
                                    onClick={() => setShowLikesModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Likes List */}
                        <div className="max-h-96 overflow-y-auto">
                            {task.likedBy && task.likedBy.length > 0 ? (
                                <div className="p-4 space-y-3">
                                    {task.likedBy.map((userId, index) => {
                                        // Find user from users list
                                        const user = users?.find(u => u.id === userId);
                                        const userName = user?.name || 'Unknown User';
                                        const userInitial = userName.charAt(0).toUpperCase();

                                        // Gradient colors for avatars
                                        const avatarColors = [
                                            'bg-gradient-to-br from-blue-400 to-blue-600',
                                            'bg-gradient-to-br from-pink-400 to-pink-600',
                                            'bg-gradient-to-br from-purple-400 to-purple-600',
                                            'bg-gradient-to-br from-green-400 to-green-600'
                                        ];
                                        const avatarColor = avatarColors[index % 4];

                                        return (
                                            <div key={userId || index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                {/* Avatar */}
                                                <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                                    <span className="text-white text-sm font-semibold">{userInitial}</span>
                                                </div>

                                                {/* User Info */}
                                                <div className="flex-1">
                                                    <div className="text-sm font-semibold text-gray-900">{userName}</div>
                                                    {user?.email && (
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    )}
                                                </div>

                                                {/* Like Icon */}
                                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-xs">👍</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="px-4 py-12 text-center text-gray-400 text-sm">
                                    Chưa có ai thích
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Status Picker */}
            <StatusPicker
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                currentStatus={task.status}
                onSelect={(status) => handleUpdateField('status', status)}
                anchorEl={statusButtonRef}
            />

            {/* Priority Picker */}
            <PriorityPicker
                isOpen={showPriorityModal}
                onClose={() => setShowPriorityModal(false)}
                currentPriority={task.priority || TaskPriority.Medium}
                onSelect={(priority) => handleUpdateField('priority', priority)}
                anchorEl={priorityButtonRef}
            />

            {/* Start Date Picker */}
            <DatePicker
                isOpen={showStartDatePicker}
                onClose={() => setShowStartDatePicker(false)}
                selectedDate={task.startDate}
                onSelect={(date) => handleUpdateField('startDate', date)}
                anchorEl={startDateButtonRef}
                title="Chọn ngày bắt đầu"
            />

            {/* Due Date Picker */}
            <DatePicker
                isOpen={showDueDatePicker}
                onClose={() => setShowDueDatePicker(false)}
                selectedDate={task.dueDate}
                onSelect={(date) => handleUpdateField('dueDate', date)}
                anchorEl={dueDateButtonRef}
                title="Chọn ngày deadline"
            />
        </div>
    );
};

export default TaskDetailModal;

