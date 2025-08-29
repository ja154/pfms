
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
  const inputStyles = "w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition";


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
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Insect Category' : 'Add New Insect Category'}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Category Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputStyles} />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Count</label>
                <input type="number" value={count} onChange={e => setCount(Number(e.target.value))} required min="0" className={inputStyles} />
            </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-3 border-t border-slate-200 rounded-b-lg">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-semibold">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white border-transparent rounded-lg hover:bg-green-700 text-sm font-semibold">Save</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditPoultryModal;