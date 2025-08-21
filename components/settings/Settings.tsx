
import React, { useState } from 'react';
import Card from '../ui/Card';
import { useData } from '../../context/DataContext';

const Settings: React.FC = () => {
    const { state, dispatch } = useData();
    const [farmName, setFarmName] = useState(state.farmName);
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'UPDATE_FARM_NAME', payload: farmName });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000); // Hide message after 2 seconds
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-brand-green-900">Settings</h2>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 mb-1">
                            Farm Name
                        </label>
                        <input
                            type="text"
                            id="farmName"
                            value={farmName}
                            onChange={(e) => setFarmName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green-500 focus:border-brand-green-500"
                        />
                    </div>
                    <div className="flex items-center justify-end">
                         {saved && <span className="text-sm text-brand-green-700 mr-4">Saved successfully!</span>}
                        <button
                            type="submit"
                            className="px-6 py-2 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Settings;
