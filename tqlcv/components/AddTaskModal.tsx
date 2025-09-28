// FIX: Implement the AddTaskModal component to allow users to create new tasks.
import React, { useState } from 'react';
import { Task, TaskStatus, SelectOption, DEPARTMENTS } from '../types';
import { CloseIcon } from './icons';
import CustomSelect from './CustomSelect';
import { useVietnameseInput } from '../hooks/useVietnameseInput';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'subtasks'>) => void;
}

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


const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.NotStarted);
  const [department, setDepartment] = useState('CV Chung');

  // Vietnamese input support
  const titleInput = useVietnameseInput({
    value: title,
    onChange: setTitle
  });

  const descriptionInput = useVietnameseInput({
    value: description,
    onChange: setDescription
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title,
      description,
      status,
      department,
      comments: [] // Initialize empty comments array with proper structure
    });
    setTitle('');
    setDescription('');
    setStatus(TaskStatus.NotStarted);
    setDepartment('CV Chung');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-2xl p-6 w-full max-w-md m-4 transition-transform duration-300 scale-95 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Công việc mới</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-200/50 transition-colors">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1">Tiêu đề</label>
            <input
              type="text"
              id="title"
              {...titleInput}
              className="w-full px-3 py-2 border border-slate-300/70 rounded-lg bg-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 no-zoom"
              style={{ fontSize: '16px', WebkitAppearance: 'none', WebkitTextSizeAdjust: '100%', transform: 'translateZ(0)' }}
              placeholder="Ví dụ: Thiết kế trang chủ"
              lang="vi"
              autoComplete="off"
              spellCheck="true"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1">Mô tả (Tùy chọn)</label>
            <textarea
              id="description"
              rows={3}
              {...descriptionInput}
              className="w-full px-3 py-2 border border-slate-300/70 rounded-lg bg-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 no-zoom"
              style={{ fontSize: '16px', WebkitAppearance: 'none', WebkitTextSizeAdjust: '100%', transform: 'translateZ(0)' }}
              placeholder="Thêm mô tả chi tiết cho công việc..."
              lang="vi"
              autoComplete="off"
              spellCheck="true"
            />
          </div>
           <div className="grid grid-cols-2 gap-4 mb-8">
             <div>
                <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-2">Trạng thái</label>
                <CustomSelect
                    options={statusOptions}
                    value={status}
                    onChange={(newValue) => setStatus(newValue as TaskStatus)}
                />
             </div>
             <div>
                <label htmlFor="department" className="block text-sm font-semibold text-slate-700 mb-2">Bộ phận</label>
                <CustomSelect
                    options={departmentOptions}
                    value={department}
                    onChange={(newValue) => setDepartment(newValue)}
                />
             </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-200/80 text-slate-800 rounded-lg hover:bg-slate-300/90 font-semibold transition-colors">
              Hủy
            </button>
            <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold shadow-lg shadow-indigo-500/20">
              Tạo công việc
            </button>
          </div>
        </form>
      </div>
       <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AddTaskModal;