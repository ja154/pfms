
import React from 'react';
import { CalendarTask, VaccinationRecord } from '../../types';

interface CalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  tasks: CalendarTask[];
  vaccinations: VaccinationRecord[];
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, selectedDate, onDateSelect, tasks, vaccinations }) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysInMonth = lastDayOfMonth.getDate();

    const days = [];
    // Pad start with previous month's days
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
    }
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }

    const taskDates = new Set(tasks.map(t => t.date));
    const vaccinationDates = new Set(vaccinations.map(v => v.nextDueDate));

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-2">
                {weekDays.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`}></div>;

                    const dateString = day.toISOString().split('T')[0];
                    const isSelected = selectedDate.toISOString().split('T')[0] === dateString;
                    const isToday = new Date().toISOString().split('T')[0] === dateString;
                    const hasTask = taskDates.has(dateString);
                    const hasVaccination = vaccinationDates.has(dateString);

                    return (
                        <div key={dateString} onClick={() => onDateSelect(day)} className={`p-2 text-center cursor-pointer rounded-lg transition-colors ${isSelected ? 'bg-brand-green-600 text-white' : isToday ? 'bg-brand-green-100' : 'hover:bg-gray-100'}`}>
                            <span className={`relative ${isSelected ? 'font-bold' : ''}`}>{day.getDate()}</span>
                            <div className="flex justify-center items-center h-2 mt-1 space-x-1">
                                {hasTask && <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>}
                                {hasVaccination && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
