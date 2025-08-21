
import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { useData } from '../../context/DataContext';

const FeedManagement: React.FC = () => {
    const { state, dispatch } = useData();
    const { feed } = state;

    const [isEditing, setIsEditing] = useState(false);
    const [editableFeed, setEditableFeed] = useState({ ...feed });

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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-brand-green-900">Feed Management</h2>
                 {isEditing ? (
                     <div className="space-x-2">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 transition-colors">Save Changes</button>
                     </div>
                 ) : (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors">Edit Data</button>
                 )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Current Stock</h3>
                    {isEditing ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Stock (kg)</label>
                            <input 
                                type="number"
                                value={editableFeed.total}
                                onChange={e => setEditableFeed({...editableFeed, total: Number(e.target.value)})}
                                className="w-full p-2 border border-gray-300 rounded-md text-2xl font-bold"
                            />
                        </div>
                    ) : (
                        <p className="text-4xl font-bold text-brand-green-700">{feed.total.toLocaleString()} kg</p>
                    )}
                     <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                        <div 
                            className="bg-brand-green-600 h-4 rounded-full"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-right">{percentage.toFixed(1)}% of 5,000kg capacity</p>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-gray-700">Consumption Details</h3>
                    <div className="mt-4 space-y-3">
                        {isEditing ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Consumption (kg/day)</label>
                                <input 
                                    type="number"
                                    value={editableFeed.dailyConsumption}
                                    onChange={e => setEditableFeed({...editableFeed, dailyConsumption: Number(e.target.value)})}
                                    className="w-full p-2 border border-gray-300 rounded-md text-xl font-bold"
                                />
                            </div>
                        ) : (
                             <div className="flex justify-between items-baseline">
                                <span className="text-gray-600">Daily Consumption:</span>
                                <span className="font-bold text-xl text-brand-brown-800">{feed.dailyConsumption} kg/day</span>
                            </div>
                        )}
                        <div className="flex justify-between items-baseline">
                            <span className="text-gray-600">Estimated Days Left:</span>
                            <span className="font-bold text-xl text-brand-brown-800">{feedDaysLeft} days</span>
                        </div>
                    </div>
                </Card>
            </div>
             <Card>
                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Feed Purchase History</h3>
                 <p className="text-gray-600">You can view and add feed purchase records in the <span className="font-bold text-brand-green-700">Records</span> section.</p>
             </Card>
        </div>
    );
};

export default FeedManagement;
