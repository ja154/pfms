import React from 'react';
import Card from '../ui/Card';
import { useData } from '../../context/DataContext';
import { RecordType, VaccinationRecord } from '../../types';

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);
const SyringeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 2 4 4"></path><path d="m17 7 3-3"></path><path d="M19 9 8.7 19.3a2.4 2.4 0 0 1-3.4 0L2.6 16.6a2.4 2.4 0 0 1 0-3.4Z"></path><path d="m14 11-4 4"></path><path d="m6 16 4-4"></path><path d="m2 22 4-4"></path></svg>
);


const UpcomingEvents: React.FC = () => {
    const { state } = useData();

    const vaccinationRecords = state.records
        .filter((r): r is VaccinationRecord => r.type === RecordType.Vaccination);

    const upcomingVaccinations = vaccinationRecords
        .filter(v => new Date(v.nextDueDate) >= new Date())
        .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime())
        .slice(0, 3);
    
    const overdueVaccinations = vaccinationRecords
        .filter(v => {
            const dueDate = new Date(v.nextDueDate);
            const today = new Date();
            today.setHours(0,0,0,0);
            return dueDate < today;
        })
        .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());

    return (
        <Card className="h-96 flex flex-col">
            <h3 className="text-lg font-semibold text-brand-green-900 mb-4">Alerts & Upcoming Events</h3>
            <div className="flex-1 overflow-y-auto space-y-4">
                {overdueVaccinations.length > 0 && overdueVaccinations.map(v => (
                     <div key={v.id} className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex-shrink-0 text-red-500 mt-1"><AlertIcon/></div>
                        <div className="ml-3">
                            <p className="text-sm font-bold text-red-700">Overdue Vaccination!</p>
                            <p className="text-xs text-red-600">{v.vaccineType}</p>
                            <p className="text-xs text-red-600">Was due: {new Date(v.nextDueDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}

                {upcomingVaccinations.length > 0 ? upcomingVaccinations.map(v => (
                    <div key={v.id} className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex-shrink-0 text-blue-500 mt-1"><SyringeIcon/></div>
                        <div className="ml-3">
                            <p className="text-sm font-semibold text-blue-700">Upcoming Vaccination</p>
                            <p className="text-xs text-blue-600">{v.vaccineType}</p>
                            <p className="text-xs text-blue-600">Due: {new Date(v.nextDueDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                )) : overdueVaccinations.length === 0 && <p className="text-gray-500 text-sm mt-4">No upcoming vaccinations scheduled.</p>}

            </div>
        </Card>
    );
};

export default UpcomingEvents;
