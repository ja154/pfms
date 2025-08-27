
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
                <h2 className="text-2xl font-bold text-brand-green-900">Poultry Inventory</h2>
                <button onClick={openAddModal} className="px-5 py-2.5 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 hover:shadow-glow-green transition-all duration-300">
                    Add New Category
                </button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-brand-brown-100">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-500 uppercase">Category</th>
                                <th className="p-4 text-sm font-semibold text-gray-500 uppercase text-right">Count</th>
                                <th className="p-4 text-sm font-semibold text-gray-500 uppercase text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.poultry.map((category, index) => (
                                <tr key={category.id} className={`border-b border-brand-brown-100 ${index % 2 === 0 ? 'bg-brand-brown-50/50' : 'bg-white'}`}>
                                    <td className="p-4 font-medium text-gray-800">{category.name}</td>
                                    <td className="p-4 font-semibold text-brand-green-800 text-right">{category.count.toLocaleString()}</td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => openEditModal(category)} className="text-blue-600 hover:text-blue-800 font-medium mr-3 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-800 font-medium hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t-2 border-gray-300">
                             <tr>
                                <td className="p-4 font-bold text-gray-800">Total</td>
                                <td className="p-4 font-bold text-brand-green-900 text-right" colSpan={2}>
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