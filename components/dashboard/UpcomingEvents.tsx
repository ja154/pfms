
import React from 'react';
import Card from '../ui/Card';
import { useData } from '../../context/DataContext';
import { RecordType, VaccinationRecord, CalendarTask } from '../../types';

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);
const SyringeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 2 4 4"></path><path d="m17 7 3-3"></path><path d="M19 9 8.7 19.3a2.4 2.4 0 0 1-3.4 0L2.6 16.6a2.4 2.4 0 0 1 0-3.4Z"></path><path d="m14 11-4 4"></path><path d="m6 16 4-4"></path><path d="m2 22 4-4"></path></svg>
);
const TaskIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1V21c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h7.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"></path><path d="M14 2v4h4"></path><path d="M10 12h4"></path><path d="M10 16h4"></path><path d="M8 8h2"></path></svg>
);

type UpcomingEvent = {
    id: string;
    date: string;
    title: string;
    description: string;
    type: 'vaccination' | 'task';
    isOverdue: boolean;
};

const UpcomingEvents: React.FC = () => {
    const { state } = useData();
    const today = new Date();
    today.setHours(0,0,0,0);

    const vaccinationEvents: UpcomingEvent[] = state.records
        .filter((r): r is VaccinationRecord => r.type === RecordType.Vaccination)
        .map(v => ({
            id: v.id,
            date: v.nextDueDate,
            title: 'Vaccination Due',
            description: v.vaccineType,
            type: 'vaccination',
            isOverdue: new Date(v.nextDueDate) < today,
        }));
    
    const taskEvents: UpcomingEvent[] = state.tasks
        .filter(t => !t.completed)
        .map(t => ({
            id: t.id,
            date: t.date,
            title: 'Task Due',
            description: t.title,
            type: 'task',
            isOverdue: new Date(t.date) < today,
        }));
    
    const allEvents = [...vaccinationEvents, ...taskEvents]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
    const overdueEvents = allEvents.filter(e => e.isOverdue);
    const upcomingEvents = allEvents.filter(e => !e.isOverdue).slice(0, 4);


    return (
        <Card className="h-96 flex flex-col">
            <h3 className="text-lg font-semibold text-brand-green-900 mb-4">Alerts & Upcoming Events</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {overdueEvents.length > 0 && overdueEvents.map(e => (
                     <div key={e.id} className="flex items-start p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                        <div className="flex-shrink-0 text-red-500 mt-1"><AlertIcon/></div>
                        <div className="ml-3">
                            <p className="text-sm font-bold text-red-700">Overdue {e.type === 'vaccination' ? 'Vaccination' : 'Task'}!</p>
                            <p className="text-xs text-red-600">{e.description}</p>
                            <p className="text-xs text-red-600">Was due: {new Date(e.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}

                {upcomingEvents.length > 0 ? upcomingEvents.map(e => (
                    <div key={e.id} className={`flex items-start p-3 rounded-r-lg bg-white border-l-4 ${
                        e.type === 'vaccination' ? 'border-blue-400' : 'border-purple-400'
                    }`}>
                        <div className={`flex-shrink-0 mt-1 ${
                            e.type === 'vaccination' ? 'text-blue-500' : 'text-purple-500'
                        }`}>{e.type === 'vaccination' ? <SyringeIcon/> : <TaskIcon/>}</div>
                        <div className="ml-3">
                            <p className={`text-sm font-semibold ${
                                e.type === 'vaccination' ? 'text-blue-700' : 'text-purple-700'
                            }`}>{e.title}</p>
                            <p className={`text-xs ${
                                e.type === 'vaccination' ? 'text-blue-600' : 'text-purple-600'
                            }`}>{e.description}</p>
                            <p className={`text-xs ${
                                e.type === 'vaccination' ? 'text-blue-600' : 'text-purple-600'
                            }`}>Due: {new Date(e.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                )) : overdueEvents.length === 0 && <p className="text-gray-500 text-sm mt-4">No upcoming events scheduled.</p>}
            </div>
        </Card>
    );
};

export default UpcomingEvents;