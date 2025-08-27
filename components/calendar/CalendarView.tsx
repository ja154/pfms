
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
                <h2 className="text-2xl font-bold text-brand-green-900">Calendar & Tasks</h2>
                <button onClick={openAddTaskModal} className="px-5 py-2.5 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 hover:shadow-glow-green transition-all duration-300">
                    Add New Task
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100">&lt;</button>
                            <h3 className="text-xl font-semibold text-brand-green-800">
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100">&gt;</button>
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
                        <h3 className="text-lg font-semibold text-brand-green-900 border-b pb-2 mb-4">
                           Events for {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h3>
                        <div className="space-y-3 h-[450px] overflow-y-auto pr-2">
                           {eventsForSelectedDay.length > 0 ? (
                               eventsForSelectedDay.map(event => (
                                   <div key={event.id} className="p-3 rounded-lg border bg-white">
                                       {event.type === 'task' ? (
                                           <div className="flex items-start">
                                                <input type="checkbox" checked={event.completed} onChange={() => handleToggleTaskCompletion(event.data as CalendarTask)} className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-green-600 focus:ring-brand-green-500" />
                                                <div className="ml-3 flex-1">
                                                    <p className={`text-sm font-medium ${event.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                        {(event.data as CalendarTask).title}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{(event.data as CalendarTask).description}</p>
                                                    <div className="mt-2 text-xs">
                                                        <button onClick={() => openEditTaskModal(event.data as CalendarTask)} className="text-blue-600 hover:underline mr-2">Edit</button>
                                                        <button onClick={() => handleDeleteTask(event.id)} className="text-red-600 hover:underline">Delete</button>
                                                    </div>
                                                </div>
                                           </div>
                                       ) : (
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3 flex-shrink-0"></div>
                                                <div>
                                                    <p className="text-sm font-medium text-blue-800">{event.title}</p>
                                                    <p className="text-xs text-gray-500">For {(event.data as VaccinationRecord).birdsVaccinated} birds</p>
                                                </div>
                                            </div>
                                       )}
                                   </div>
                               ))
                           ) : (
                                <p className="text-center text-gray-500 pt-16">No events for this day.</p>
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