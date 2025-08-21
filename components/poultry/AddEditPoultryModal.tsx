
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { PoultryCategory } from '../../types';
import Modal from '../ui/Modal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: PoultryCategory | null;
}

const AddEditPoultryModal: React.FC<ModalProps> = ({ isOpen, onClose, categoryToEdit }) => {
  const { dispatch } = useData();
  const isEditMode = !!categoryToEdit;
  
  const [name, setName] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isEditMode) {
      setName(categoryToEdit.name);
      setCount(categoryToEdit.count);
    } else {
      setName('');
      setCount(0);
    }
  }, [categoryToEdit, isEditMode, isOpen]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (isEditMode) {
      dispatch({ type: 'UPDATE_POULTRY_CATEGORY', payload: { ...categoryToEdit, name, count } });
    } else {
      const newCategory: PoultryCategory = {
        id: `p_${new Date().getTime()}`,
        name,
        count
      };
      dispatch({ type: 'ADD_POULTRY_CATEGORY', payload: newCategory });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Poultry Category' : 'Add New Poultry Category'}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Count</label>
                <input type="number" value={count} onChange={e => setCount(Number(e.target.value))} required min="0" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700">Save</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditPoultryModal;
