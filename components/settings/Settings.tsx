
import React, { useState, useRef } from 'react';
import Card from '../ui/Card';
import { useData } from '../../context/DataContext';

const Settings: React.FC = () => {
    const { state, dispatch } = useData();
    const [farmName, setFarmName] = useState(state.farmName);
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'UPDATE_FARM_NAME', payload: farmName });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000); // Hide message after 2 seconds
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(state, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `${state.farmName.replace(/\s+/g, '_')}_backup_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File content is not readable");
                
                const importedState = JSON.parse(text);

                // Basic validation
                if (importedState.farmName && Array.isArray(importedState.records)) {
                     if (window.confirm("Are you sure you want to import this data? This will overwrite all current data in the application.")) {
                        dispatch({ type: 'REPLACE_STATE', payload: importedState });
                        alert("Data imported successfully!");
                        // Force a reload or update state locally
                        setFarmName(importedState.farmName);
                    }
                } else {
                    throw new Error("Invalid data structure in JSON file.");
                }
            } catch (error) {
                console.error("Failed to import data:", error);
                alert(`Error importing file: ${error instanceof Error ? error.message : "Unknown error"}`);
            } finally {
                // Reset file input to allow re-uploading the same file
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsText(file);
    };


    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                <p className="text-slate-500 mt-1">Manage your farm's general settings and data.</p>
            </div>
            
            <Card>
                 <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-3">General Settings</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="farmName" className="block text-sm font-medium text-slate-600 mb-1">
                            Farm Name
                        </label>
                        <input
                            type="text"
                            id="farmName"
                            value={farmName}
                            onChange={(e) => setFarmName(e.target.value)}
                            className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        />
                    </div>
                    <div className="flex items-center justify-end">
                         {saved && <span className="text-sm text-green-600 mr-4">Saved successfully!</span>}
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 border border-transparent text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-3">Data Management</h3>
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm font-medium text-slate-800">Export Data</p>
                        <p className="text-sm text-slate-500 mt-1 mb-3">Download a JSON file of all your farm data. This is useful for backups or migrating to another device.</p>
                        <button onClick={handleExport} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-semibold">
                            Export Data
                        </button>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm font-medium text-red-800">Import Data</p>
                        <p className="text-sm text-red-600 mt-1 mb-3">Import data from a previously exported JSON file. <strong className="font-semibold">Warning:</strong> This will overwrite all existing data.</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImport}
                            accept=".json"
                            className="hidden"
                            id="import-file"
                        />
                         <label htmlFor="import-file" className="cursor-pointer px-4 py-2 bg-white text-red-700 border border-red-300 rounded-lg hover:bg-red-100 text-sm font-semibold">
                           Import Data
                        </label>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Settings;