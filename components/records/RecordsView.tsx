
import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { useData } from '../../context/DataContext';
import { FarmRecord, RecordType } from '../../types';
import AddRecordModal from './AddRecordModal';

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
            className={`px-4 py-1.5 text-sm font-medium rounded-full mb-2 transition-colors ${
                filter === filterValue 
                ? 'bg-brand-green-600 text-white shadow' 
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
            }`}>
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-brand-green-900">Farm Records</h2>
                <button onClick={openAddModal} className="px-5 py-2.5 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 hover:shadow-glow-green transition-all duration-300">
                    Add New Record
                </button>
            </div>
            
            <Card>
                <div className="flex justify-start space-x-2 mb-4 border-b border-gray-200 pb-2 flex-wrap">
                    <FilterButton label="All" filterValue="all" />
                    <FilterButton label={RecordType.FeedPurchase} filterValue={RecordType.FeedPurchase} />
                    <FilterButton label={RecordType.Vaccination} filterValue={RecordType.Vaccination} />
                    <FilterButton label={RecordType.PoultryCountChange} filterValue={RecordType.PoultryCountChange} />
                </div>

                <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="border-b-2 border-gray-100 bg-gray-50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((record) => (
                                <tr key={record.id} className="border-b border-gray-100 hover:bg-brand-green-50/50 transition-colors">
                                    <td className="p-4 font-medium text-gray-600 whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            record.type === RecordType.Vaccination ? 'bg-blue-100 text-blue-800' :
                                            record.type === RecordType.FeedPurchase ? 'bg-amber-100 text-amber-800' :
                                            'bg-purple-100 text-purple-800'
                                        }`}>
                                            {record.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700">{getRecordDescription(record)}</td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => openEditModal(record)} className="text-blue-600 hover:text-blue-800 font-medium mr-3 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:text-red-800 font-medium hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                </div>

                {filteredRecords.length === 0 && <p className="text-center text-gray-500 py-8">No records found for this category.</p>}
            </Card>

            <AddRecordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} recordToEdit={editingRecord} />
        </div>
    );
};

export default RecordsView;