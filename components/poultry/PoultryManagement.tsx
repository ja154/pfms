
import React, { useState } from 'react';
import Card from '../ui/Card';
import { useData } from '../../context/DataContext';
import AddEditPoultryModal from './AddEditPoultryModal';
import { PoultryCategory } from '../../types';

const PoultryManagement: React.FC = () => {
    const { state, dispatch } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<PoultryCategory | null>(null);

    const openAddModal = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (category: PoultryCategory) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if(window.confirm('Are you sure you want to delete this category?')){
            dispatch({ type: 'DELETE_POULTRY_CATEGORY', payload: id });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Insect Inventory</h2>
                <button onClick={openAddModal} className="px-4 py-2 bg-green-600 border border-transparent text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold">
                    Add New Category
                </button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-slate-200">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">Count</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {state.poultry.map((category) => (
                                <tr key={category.id}>
                                    <td className="p-4 font-medium text-slate-800">{category.name}</td>
                                    <td className="p-4 font-semibold text-slate-800 text-right">{category.count.toLocaleString()}</td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => openEditModal(category)} className="text-green-600 hover:underline text-sm font-semibold mr-4">Edit</button>
                                        <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:underline text-sm font-semibold">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t-2 border-slate-200">
                             <tr>
                                <td className="p-4 font-bold text-slate-900">Total</td>
                                <td className="p-4 font-bold text-slate-900 text-right" colSpan={2}>
                                    {state.poultry.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
                                </td>
                             </tr>
                        </tfoot>
                    </table>
                </div>
            </Card>

            <AddEditPoultryModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categoryToEdit={editingCategory}
            />
        </div>
    );
};

export default PoultryManagement;