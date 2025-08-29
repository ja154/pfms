import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { TabBookTransaction } from '../../types';
import Modal from '../ui/Modal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: TabBookTransaction | null;
}

const AddEditTransactionModal: React.FC<ModalProps> = ({ isOpen, onClose, transactionToEdit }) => {
  const { state, dispatch } = useData();
  const isEditMode = !!transactionToEdit;
  
  const [supplierId, setSupplierId] = useState(state.suppliers[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const inputStyles = "w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-green-500 transition-shadow";


  useEffect(() => {
    if (isOpen) {
        if (isEditMode) {
            setSupplierId(transactionToEdit.supplierId);
            setDate(transactionToEdit.date);
            setDescription(transactionToEdit.description);
            setAmount(transactionToEdit.amount);
        } else {
            setSupplierId(state.suppliers[0]?.id || '');
            setDate(new Date().toISOString().split('T')[0]);
            setDescription('');
            setAmount(0);
        }
    }
  }, [transactionToEdit, isEditMode, isOpen, state.suppliers]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !supplierId || !date) return;

    if (isEditMode) {
      dispatch({ 
          type: 'UPDATE_TAB_TRANSACTION', 
          payload: { ...transactionToEdit, supplierId, date, description, amount } 
      });
    } else {
      const newTransaction: TabBookTransaction = {
        id: `t_${new Date().getTime()}`,
        supplierId,
        date,
        description,
        amount,
      };
      dispatch({ type: 'ADD_TAB_TRANSACTION', payload: newTransaction });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Transaction' : 'Add New Transaction'}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <select value={supplierId} onChange={e => setSupplierId(e.target.value)} required className={inputStyles}>
                   {state.suppliers.length > 0 ? (
                       state.suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                   ) : (
                       <option disabled>Please add a supplier first</option>
                   )}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={inputStyles} />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} required className={inputStyles} placeholder="e.g., 5 bags of feed, Payment" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input type="number" step="0.01" value={amount} onChange={e => setAmount(Number(e.target.value))} required className={inputStyles} />
                <p className="text-xs text-gray-500 mt-1">
                    Enter a <strong className="text-red-600">positive</strong> amount for goods taken on credit (you owe more). <br/>
                    Enter a <strong className="text-green-600">negative</strong> amount for payments or credits (you owe less).
                </p>
            </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
          <button type="submit" className="px-5 py-2.5 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 hover:shadow-glow-green transition-all duration-300">Save Transaction</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditTransactionModal;