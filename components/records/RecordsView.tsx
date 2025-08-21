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
            return `${record.birdsVaccinated} birds vaccinated for ${record.vaccineType}. Next due: ${new Date(record.nextDueDate).toLocaleDateString()}`;
        }
        if (record.type === RecordType.PoultryCountChange) {
          const changeText = record.changeType === 'addition' ? 'Added' : 'Reduced count of';
          const reasonText = record.reason.charAt(0).toUpperCase() + record.reason.slice(1);
          return `${changeText} ${record.poultryCategoryName} by ${record.changeAmount}. Reason: ${reasonText}.`;
        }
        return '';
    };

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-brand-green-900">Farm Records</h2>
                <button onClick={openAddModal} className="px-4 py-2 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 transition-colors">
                    Add New Record
                </button>
            </div>
            
            <Card>
                <div className="flex justify-start space-x-2 mb-4 border-b border-gray-200 pb-2 flex-wrap">
                    <button onClick={() => setFilter('all')} className={`px-4 py-1.5 text-sm font-medium rounded-full mb-2 ${filter === 'all' ? 'bg-brand-green-600 text-white' : 'text-gray-600 hover:bg-brand-green-100'}`}>All</button>
                    <button onClick={() => setFilter(RecordType.FeedPurchase)} className={`px-4 py-1.5 text-sm font-medium rounded-full mb-2 ${filter === RecordType.FeedPurchase ? 'bg-brand-green-600 text-white' : 'text-gray-600 hover:bg-brand-green-100'}`}>{RecordType.FeedPurchase}</button>
                    <button onClick={() => setFilter(RecordType.Vaccination)} className={`px-4 py-1.5 text-sm font-medium rounded-full mb-2 ${filter === RecordType.Vaccination ? 'bg-brand-green-600 text-white' : 'text-gray-600 hover:bg-brand-green-100'}`}>{RecordType.Vaccination}</button>
                    <button onClick={() => setFilter(RecordType.PoultryCountChange)} className={`px-4 py-1.5 text-sm font-medium rounded-full mb-2 ${filter === RecordType.PoultryCountChange ? 'bg-brand-green-600 text-white' : 'text-gray-600 hover:bg-brand-green-100'}`}>{RecordType.PoultryCountChange}</button>
                </div>

                <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="border-b-2 border-brand-brown-100">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-500 uppercase">Date</th>
                                <th className="p-4 text-sm font-semibold text-gray-500 uppercase">Type</th>
                                <th className="p-4 text-sm font-semibold text-gray-500 uppercase">Details</th>
                                <th className="p-4 text-sm font-semibold text-gray-500 uppercase text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((record, index) => (
                                <tr key={record.id} className={`border-b border-brand-brown-100 ${index % 2 === 0 ? 'bg-brand-brown-50/50' : 'bg-white'}`}>
                                    <td className="p-4 font-medium text-gray-600 whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            record.type === RecordType.Vaccination ? 'bg-blue-100 text-blue-800' :
                                            record.type === RecordType.FeedPurchase ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-purple-100 text-purple-800'
                                        }`}>
                                            {record.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700">{getRecordDescription(record)}</td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => openEditModal(record)} className="text-blue-600 hover:text-blue-800 font-medium mr-3">Edit</button>
                                        <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
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