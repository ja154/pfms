
import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { useData } from '../../context/DataContext';
import { FarmRecord, RecordType, PoultryCountChangeRecord } from '../../types';
import AddRecordModal from './AddRecordModal';

const recordTypeColors: Record<RecordType, string> = {
    [RecordType.FeedPurchase]: 'bg-blue-100 text-blue-800',
    [RecordType.Vaccination]: 'bg-amber-100 text-amber-800',
    [RecordType.PoultryCountChange]: 'bg-purple-100 text-purple-800',
};

const RecordsView: React.FC = () => {
    const { state, dispatch } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<FarmRecord | null>(null);

    // Tab and filter states
    const [activeTab, setActiveTab] = useState<'all' | 'countHistory'>('all');
    const [allRecordsFilter, setAllRecordsFilter] = useState<'all' | RecordType>('all');
    const [historyCategoryFilter, setHistoryCategoryFilter] = useState<string>('all');
    const [historyStartDate, setHistoryStartDate] = useState<string>('');
    const [historyEndDate, setHistoryEndDate] = useState<string>('');

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
        if (allRecordsFilter === 'all') {
            return state.records;
        }
        return state.records.filter(record => record.type === allRecordsFilter);
    }, [state.records, allRecordsFilter]);
    
    const poultryCountHistory = useMemo(() => {
        let history = state.records.filter(
            (r): r is PoultryCountChangeRecord => r.type === RecordType.PoultryCountChange
        );

        if (historyCategoryFilter !== 'all') {
            history = history.filter(r => r.poultryCategoryId === historyCategoryFilter);
        }
        if (historyStartDate) {
            history = history.filter(r => r.date >= historyStartDate);
        }
        if (historyEndDate) {
            history = history.filter(r => r.date <= historyEndDate);
        }
        return history;
    }, [state.records, historyCategoryFilter, historyStartDate, historyEndDate]);

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
            onClick={() => setAllRecordsFilter(filterValue)} 
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                allRecordsFilter === filterValue 
                ? 'bg-green-600 text-white' 
                : 'text-slate-600 bg-white hover:bg-slate-50 border border-slate-300'
            }`}>
            {label}
        </button>
    );

    const TabButton: React.FC<{label: string; tabValue: 'all' | 'countHistory'}> = ({ label, tabValue }) => (
        <button
            onClick={() => setActiveTab(tabValue)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tabValue
                ? 'border-green-600 text-green-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
        >
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
            
            <Card className="p-0">
                <div className="flex border-b border-slate-200">
                    <TabButton label="All Records" tabValue="all" />
                    <TabButton label="Insect Count History" tabValue="countHistory" />
                </div>
                
                {activeTab === 'all' && (
                    <div className="p-6">
                        <div className="flex justify-start space-x-2 mb-4 flex-wrap">
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
                    </div>
                )}
                
                {activeTab === 'countHistory' && (
                    <div className="p-6">
                        <div className="flex flex-wrap gap-4 items-end p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-slate-600 mb-1">Insect Category</label>
                                <select value={historyCategoryFilter} onChange={e => setHistoryCategoryFilter(e.target.value)} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition">
                                    <option value="all">All Categories</option>
                                    {state.poultry.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-slate-600 mb-1">Start Date</label>
                                <input type="date" value={historyStartDate} onChange={e => setHistoryStartDate(e.target.value)} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-slate-600 mb-1">End Date</label>
                                <input type="date" value={historyEndDate} onChange={e => setHistoryEndDate(e.target.value)} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
                            </div>
                            <button onClick={() => { setHistoryCategoryFilter('all'); setHistoryStartDate(''); setHistoryEndDate(''); }} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-semibold">Clear Filters</button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b-2 border-slate-200">
                                    <tr>
                                        <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                                        <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                                        <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-center">Change</th>
                                        <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Reason</th>
                                        <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {poultryCountHistory.map((record) => (
                                        <tr key={record.id}>
                                            <td className="p-4 font-medium text-slate-800 whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                                            <td className="p-4 text-slate-700">{record.poultryCategoryName}</td>
                                            <td className={`p-4 font-semibold text-center ${record.changeType === 'addition' ? 'text-green-600' : 'text-red-600'}`}>
                                                {record.changeType === 'addition' ? '+' : '-'}{record.changeAmount.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-slate-700">{record.reason.charAt(0).toUpperCase() + record.reason.slice(1)}</td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => openEditModal(record)} className="text-green-600 hover:underline text-sm font-semibold mr-4">Edit</button>
                                                <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:underline text-sm font-semibold">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             {poultryCountHistory.length === 0 && <p className="text-center text-slate-500 py-8">No insect count changes found for the selected filters.</p>}
                        </div>
                    </div>
                )}

            </Card>

            <AddRecordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} recordToEdit={editingRecord} />
        </div>
    );
};

export default RecordsView;
