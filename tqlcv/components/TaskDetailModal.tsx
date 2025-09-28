import React from 'react';
import { Task, User } from '../types';
import TaskDetail from './TaskDetail';

interface TaskDetailModalProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (task: Task) => void;
    onDelete: (taskId: string) => void;
    isReadOnly: boolean;
    selectedUser: User | null;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
    task,
    isOpen,
    onClose,
    onUpdate,
    onDelete,
    isReadOnly,
    selectedUser
}) => {
    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Enhanced Backdrop with stronger blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 z-50">
                <div className="w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-h-[90vh] flex flex-col animate-slide-up overflow-hidden">
                    {/* Modal Header with enhanced styling */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 truncate font-roboto">
                                {task.title || 'Chi tiết công việc'}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100/80 transition-all duration-200 hover:scale-105"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Modal Content with enhanced scrolling */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        <div className="pb-8">
                            <TaskDetail
                                task={task}
                                onClose={onClose}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                                isReadOnly={isReadOnly}
                                selectedUser={selectedUser}
                                isMobileModal={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
