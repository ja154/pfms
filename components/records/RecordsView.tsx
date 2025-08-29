
import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { useData } from '../../context/DataContext';
import { FarmRecord, RecordType } from '../../types';
import AddRecordModal from './AddRecordModal';

const recordTypeColors: Record<RecordType, string> = {
    [RecordType.FeedPurchase]: 'bg-blue-100 text-blue-800',
    [RecordType.Vaccination]: 'bg-amber-100 text-amber-800',
    [RecordType.PoultryCountChange]: 'bg-purple-100 text-purple-800',
};

const RecordsView: React.FC = () => {
    const { state, dispatch } = useData();
    const [filter, setFilter] = useState<'all' | RecordType>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<FarmRecord | null>(null);

    const openAddModal = () => {
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record: FarmRecord) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if(window.confirm('Are you sure you want to delete this record? This will revert any associated inventory changes.')){
            dispatch({ type: 'DELETE_RECORD', payload: id });
        }
    }

    const filteredRecords = useMemo(() => {
        if (filter === 'all') {
            return state.records;
        }
        return state.records.filter(record => record.type === filter);
    }, [state.records, filter]);

    const getRecordDescription = (record: FarmRecord) => {
        if (record.type === RecordType.FeedPurchase) {
            return `Purchased ${record.amount}kg from ${record.supplier} for $${record.cost}.`;
        }
        if (record.type === RecordType.Vaccination) {
            return `${record.birdsVaccinated} units serviced for ${record.vaccineType}. Next due: ${new Date(record.nextDueDate).toLocaleDateString()}`;
        }
        if (record.type === RecordType.PoultryCountChange) {
          const changeText = record.changeType === 'addition' ? 'Added' : 'Reduced count of';
          const reasonText = record.reason.charAt(0).toUpperCase() + record.reason.slice(1);
          return `${changeText} ${record.poultryCategoryName} by ${record.changeAmount}. Reason: ${reasonText}.`;
        }
        return '';
    };

    const FilterButton: React.FC<{label: string; filterValue: 'all' | RecordType}> = ({ label, filterValue }) => (
        <button 
            onClick={() => setFilter(filterValue)} 
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === filterValue 
                ? 'bg-green-600 text-white' 
                : 'text-slate-600 bg-white hover:bg-slate-50 border border-slate-300'
            }`}>
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Farm Records</h2>
                <button onClick={openAddModal} className="px-4 py-2 bg-green-600 border border-transparent text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold">
                    Add New Record
                </button>
            </div>
            
            <Card>
                <div className="flex justify-start space-x-2 mb-4 border-b border-slate-200 pb-4 flex-wrap">
                    <FilterButton label="All" filterValue="all" />
                    <FilterButton label={RecordType.FeedPurchase} filterValue={RecordType.FeedPurchase} />
                    <FilterButton label={RecordType.Vaccination} filterValue={RecordType.Vaccination} />
                    <FilterButton label={RecordType.PoultryCountChange} filterValue={RecordType.PoultryCountChange} />
                </div>

                <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="border-b-2 border-slate-200">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Details</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRecords.map((record) => (
                                <tr key={record.id}>
                                    <td className="p-4 font-medium text-slate-800 whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${recordTypeColors[record.type]}`}>
                                            {record.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-700">{getRecordDescription(record)}</td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => openEditModal(record)} className="text-green-600 hover:underline text-sm font-semibold mr-4">Edit</button>
                                        <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:underline text-sm font-semibold">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                </div>

                {filteredRecords.length === 0 && <p className="text-center text-slate-500 py-8">No records found for this category.</p>}
            </Card>

            <AddRecordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} recordToEdit={editingRecord} />
        </div>
    );
};

export default RecordsView;