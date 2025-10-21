import React, { useState, useEffect } from 'react';
import { ActionSheet } from './ActionSheet';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null | undefined;
  onSelect: (date: string) => void;
  anchorEl?: HTMLElement | null;
  title?: string;
}

// Helper functions
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateWithDay = (date: Date): string => {
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName}, ${day} ${month} ${year}`;
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const getDaysInMonth = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  const days: Date[] = [];
  
  // Add days from previous month to fill the first week
  const firstDayOfWeek = firstDay.getDay();
  if (firstDayOfWeek > 0) {
    const prevMonthLastDay = new Date(year, month, 0);
    const prevMonthDays = prevMonthLastDay.getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthDays - i));
    }
  }
  
  // Add days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  
  // Add days from next month to fill the last week
  const remainingDays = 7 - (days.length % 7);
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
  }
  
  return days;
};

const parseDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;
  
  // Try parsing ISO format (YYYY-MM-DD)
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
  }
  
  // Try parsing DD/MM/YYYY format
  const ddmmyyyyMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (ddmmyyyyMatch) {
    return new Date(parseInt(ddmmyyyyMatch[3]), parseInt(ddmmyyyyMatch[2]) - 1, parseInt(ddmmyyyyMatch[1]));
  }
  
  return null;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelect,
  anchorEl,
  title = 'Chọn ngày',
}) => {
  const parsedSelectedDate = parseDate(selectedDate);
  const [currentMonth, setCurrentMonth] = useState(parsedSelectedDate || new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(parsedSelectedDate);

  useEffect(() => {
    if (isOpen) {
      const parsed = parseDate(selectedDate);
      setTempSelectedDate(parsed);
      setCurrentMonth(parsed || new Date());
    }
  }, [isOpen, selectedDate]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleSelectToday = () => {
    const today = new Date();
    setTempSelectedDate(today);
    setCurrentMonth(today);
  };

  const handleSelectDate = (date: Date) => {
    setTempSelectedDate(date);
  };

  const handleConfirm = () => {
    if (tempSelectedDate) {
      // Format as ISO date string (YYYY-MM-DD)
      const year = tempSelectedDate.getFullYear();
      const month = (tempSelectedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = tempSelectedDate.getDate().toString().padStart(2, '0');
      onSelect(`${year}-${month}-${day}`);
    }
    onClose();
  };

  const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <ActionSheet isOpen={isOpen} onClose={onClose} title={title} anchorEl={anchorEl}>
      <div className="p-4">
        {/* Month/Year Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            {tempSelectedDate && (
              <div className="text-xs text-gray-500 mt-1">
                {formatDateWithDay(tempSelectedDate)}
              </div>
            )}
          </div>
          
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Day Names Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
            const isTodayDate = isToday(date);
            const isSelected = tempSelectedDate && isSameDay(date, tempSelectedDate);

            return (
              <button
                key={index}
                onClick={() => handleSelectDate(date)}
                className={`
                  h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-150 active:scale-95
                  ${!isCurrentMonth ? 'text-gray-400' : 'text-black'}
                  ${isTodayDate && !isSelected ? 'bg-blue-100/80 text-blue-600' : ''}
                  ${isSelected ? 'bg-[#007AFF] text-white shadow-lg' : 'hover:bg-gray-100'}
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-gray-200/50">
          <button
            onClick={handleSelectToday}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            Hôm nay
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={!tempSelectedDate}
            className={`
              flex-1 px-4 py-3 rounded-xl font-semibold transition-all active:scale-95
              ${tempSelectedDate 
                ? 'bg-[#007AFF] text-white hover:bg-[#0051D5]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
            `}
          >
            Xong
          </button>
        </div>
      </div>
    </ActionSheet>
  );
};

