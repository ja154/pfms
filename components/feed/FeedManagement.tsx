
import React, { useState, useEffect, useMemo } from 'react';
import Card from '../ui/Card';
import { useData } from '../../context/DataContext';
import { RecordType, FeedPurchaseRecord } from '../../types';

const FeedManagement: React.FC = () => {
    const { state, dispatch } = useData();
    const { feed, records } = state;

    const [isEditing, setIsEditing] = useState(false);
    const [editableFeed, setEditableFeed] = useState({ ...feed });
    const inputStyles = "w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition";


    useEffect(() => {
        setEditableFeed(feed);
    }, [feed]);

    const handleSave = () => {
        dispatch({ type: 'UPDATE_FEED', payload: {
            total: Number(editableFeed.total) || 0,
            dailyConsumption: Number(editableFeed.dailyConsumption) || 0,
        }});
        setIsEditing(false);
    };

    const feedDaysLeft = editableFeed.total > 0 && editableFeed.dailyConsumption > 0 ? Math.floor(editableFeed.total / editableFeed.dailyConsumption) : 0;
    const stockPercentage = 5000; // Assuming max capacity is 5000kg for percentage calculation
    const percentage = Math.min((editableFeed.total / stockPercentage) * 100, 100);

    const feedPurchaseHistory = useMemo(() => {
        return records
            .filter((r): r is FeedPurchaseRecord => r.type === RecordType.FeedPurchase)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [records]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-900">Feed Management</h2>
                 {isEditing ? (
                     <div className="space-x-2">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-semibold">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white border-transparent rounded-lg hover:bg-green-700 text-sm font-semibold">Save Changes</button>
                     </div>
                 ) : (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-semibold">Edit Data</button>
                 )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Stock</h3>
                    {isEditing ? (
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Total Stock (kg)</label>
                            <input 
                                type="number"
                                value={editableFeed.total}
                                onChange={e => setEditableFeed({...editableFeed, total: Number(e.target.value)})}
                                className={`${inputStyles} text-2xl font-bold`}
                            />
                        </div>
                    ) : (
                        <p className="text-4xl font-bold text-slate-900">{feed.total.toLocaleString()} kg</p>
                    )}
                     <div className="w-full bg-slate-200 h-4 mt-4 rounded-full overflow-hidden">
                        <div 
                            className="bg-green-600 h-full"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2 text-right">{percentage.toFixed(1)}% of 5,000kg capacity</p>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-slate-900">Consumption Details</h3>
                    <div className="mt-4 space-y-3">
                        {isEditing ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Daily Consumption (kg/day)</label>
                                <input 
                                    type="number"
                                    value={editableFeed.dailyConsumption}
                                    onChange={e => setEditableFeed({...editableFeed, dailyConsumption: Number(e.target.value)})}
                                    className={`${inputStyles} text-xl font-bold`}
                                />
                            </div>
                        ) : (
                             <div className="flex justify-between items-baseline">
                                <span className="text-slate-600">Daily Consumption:</span>
                                <span className="font-bold text-xl text-slate-800">{feed.dailyConsumption} kg/day</span>
                            </div>
                        )}
                        <div className="flex justify-between items-baseline">
                            <span className="text-slate-600">Estimated Days Left:</span>
                            <span className="font-bold text-xl text-slate-800">{feedDaysLeft} days</span>
                        </div>
                    </div>
                </Card>
            </div>
             <Card>
                 <h3 className="text-lg font-semibold text-slate-900 mb-4">Feed Purchase History</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-slate-200">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Supplier</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">Amount (kg)</th>

                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {feedPurchaseHistory.length > 0 ? (
                                feedPurchaseHistory.map((record) => (
                                    <tr key={record.id}>
                                        <td className="p-4 font-medium text-slate-800 whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium text-slate-800">{record.supplier}</td>
                                        <td className="p-4 font-semibold text-slate-800 text-right">{record.amount.toLocaleString()}</td>
                                        <td className="p-4 font-semibold text-slate-800 text-right">${record.cost.toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center text-slate-500 py-8">No feed purchase records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 </div>
             </Card>
        </div>
    );
};

export default FeedManagement;