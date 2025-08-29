
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import Calendar from './Calendar';
import { CalendarTask, RecordType, VaccinationRecord } from '../../types';
import Card from '../ui/Card';
import AddEditTaskModal from './AddEditTaskModal';

type Event = {
  id: string;
  title: string;
  type: 'task' | 'vaccination';
  completed?: boolean;
  data: CalendarTask | VaccinationRecord;
}

const CalendarView: React.FC = () => {
    const { state, dispatch } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<CalendarTask | null>(null);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    
    const openAddTaskModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    }
    
    const openEditTaskModal = (task: CalendarTask) => {
        setEditingTask(task);
        setIsModalOpen(true);
    }
    
    const handleDeleteTask = (taskId: string) => {
        if(window.confirm('Are you sure you want to delete this task?')){
            dispatch({ type: 'DELETE_TASK', payload: taskId });
        }
    }

    const handleToggleTaskCompletion = (task: CalendarTask) => {
        dispatch({ type: 'UPDATE_TASK', payload: { ...task, completed: !task.completed }});
    }

    const selectedDateString = selectedDate.toISOString().split('T')[0];

    const eventsForSelectedDay: Event[] = useMemo(() => {
        const tasks: Event[] = state.tasks
            .filter(t => t.date === selectedDateString)
            .map(t => ({ id: t.id, title: t.title, type: 'task', completed: t.completed, data: t }));

        const vaccinations: Event[] = state.records
            .filter((r): r is VaccinationRecord => r.type === RecordType.Vaccination)
            .filter(v => v.nextDueDate === selectedDateString)
            .map(v => ({ id: v.id, title: `Vaccination: ${v.vaccineType}`, type: 'vaccination', data: v }));
            
        return [...tasks, ...vaccinations];
    }, [state.tasks, state.records, selectedDateString]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Calendar & Tasks</h2>
                <button onClick={openAddTaskModal} className="px-4 py-2 bg-green-600 border border-transparent text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold">
                    Add New Task
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800">&lt;</button>
                            <h3 className="text-xl font-semibold text-slate-800">
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800">&gt;</button>
                        </div>
                        <Calendar 
                            currentDate={currentDate} 
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                            tasks={state.tasks}
                            vaccinations={state.records.filter((r): r is VaccinationRecord => r.type === RecordType.Vaccination)}
                        />
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                           Events for {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h3>
                        <div className="space-y-3 h-[450px] overflow-y-auto pr-2">
                           {eventsForSelectedDay.length > 0 ? (
                               eventsForSelectedDay.map(event => (
                                   <div key={event.id} className={`p-3 border-l-4 rounded ${event.type === 'task' ? 'bg-slate-50 border-purple-500' : 'bg-blue-50 border-blue-500'}`}>
                                       {event.type === 'task' ? (
                                           <div className="flex items-start">
                                                <input type="checkbox" checked={event.completed} onChange={() => handleToggleTaskCompletion(event.data as CalendarTask)} className="mt-1 h-4 w-4 border-slate-300 rounded text-green-600 focus:ring-green-500" />
                                                <div className="ml-3 flex-1">
                                                    <p className={`text-sm font-medium ${event.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                                                        {(event.data as CalendarTask).title}
                                                    </p>
                                                    <p className="text-xs text-slate-600">{(event.data as CalendarTask).description}</p>
                                                    <div className="mt-2 text-xs">
                                                        <button onClick={() => openEditTaskModal(event.data as CalendarTask)} className="text-green-600 hover:underline font-semibold mr-3">Edit</button>
                                                        <button onClick={() => handleDeleteTask(event.id)} className="text-red-600 hover:underline font-semibold">Delete</button>
                                                    </div>
                                                </div>
                                           </div>
                                       ) : (
                                            <div className="flex items-center">
                                                <div className="text-blue-600 mr-3 flex-shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 2 4 4"></path><path d="m17 7 3-3"></path><path d="M19 9 8.7 19.3a2.4 2.4 0 0 1-3.4 0L2.6 16.6a2.4 2.4 0 0 1 0-3.4Z"></path><path d="m14 11-4 4"></path><path d="m6 16 4-4"></path><path d="m2 22 4-4"></path></svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">{event.title}</p>
                                                    <p className="text-xs text-slate-600">For {(event.data as VaccinationRecord).birdsVaccinated} birds</p>
                                                </div>
                                            </div>
                                       )}
                                   </div>
                               ))
                           ) : (
                                <p className="text-center text-slate-500 pt-16">No events for this day.</p>
                           )}
                        </div>
                    </Card>
                </div>
            </div>

            <AddEditTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                taskToEdit={editingTask}
                selectedDate={isModalOpen && !editingTask ? selectedDateString : undefined}
            />
        </div>
    );
};

export default CalendarView;