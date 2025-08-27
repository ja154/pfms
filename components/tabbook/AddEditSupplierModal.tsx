
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <p className="text-xs text-gray-500">
                Note: The supplier's balance is calculated automatically from their transactions. To add an opening balance, create a new transaction for this supplier.
            </p>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700">Save Supplier</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditSupplierModal;
