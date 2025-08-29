
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Supplier } from '../../types';
import Modal from '../ui/Modal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierToEdit?: Supplier | null;
}

const AddEditSupplierModal: React.FC<ModalProps> = ({ isOpen, onClose, supplierToEdit }) => {
  const { dispatch } = useData();
  const isEditMode = !!supplierToEdit;
  
  const [name, setName] = useState('');
  const inputStyles = "w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition";


  useEffect(() => {
    if (isOpen) {
        if (isEditMode) {
            setName(supplierToEdit.name);
        } else {
            setName('');
        }
    }
  }, [supplierToEdit, isEditMode, isOpen]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (isEditMode) {
      dispatch({ type: 'UPDATE_SUPPLIER', payload: { ...supplierToEdit, name } });
    } else {
      const newSupplier: Supplier = {
        id: `s_${new Date().getTime()}`,
        name,
        balance: 0
      };
      dispatch({ type: 'ADD_SUPPLIER', payload: newSupplier });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Supplier' : 'Add New Supplier'}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Supplier Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputStyles} />
            </div>
            <p className="text-xs text-slate-500 p-3 bg-slate-50 rounded-md">
                Note: The supplier's balance is calculated automatically from their transactions. To add an opening balance, create a new transaction for this supplier.
            </p>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-3 border-t border-slate-200 rounded-b-lg">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-semibold">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white border-transparent rounded-lg hover:bg-green-700 text-sm font-semibold">Save Supplier</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditSupplierModal;