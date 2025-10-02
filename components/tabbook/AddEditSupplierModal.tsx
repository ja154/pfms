
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Supplier, TabBookTransaction } from '../../types';
import Modal from '../ui/Modal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierToEdit?: Supplier | null;
}

const AddEditSupplierModal: React.FC<ModalProps> = ({ isOpen, onClose, supplierToEdit }) => {
  const { state, dispatch } = useData();
  const isEditMode = !!supplierToEdit;
  
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState(0);
  const [openingBalanceTransaction, setOpeningBalanceTransaction] = useState<TabBookTransaction | null>(null);
  const inputStyles = "w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition";


  useEffect(() => {
    if (isOpen) {
        if (isEditMode && supplierToEdit) {
            setName(supplierToEdit.name);
            // Find the opening balance transaction. We assume there's at most one.
            const obTransaction = state.tabBookTransactions.find(t => 
                t.supplierId === supplierToEdit.id && t.description === 'Opening Balance'
            );
            if (obTransaction) {
                setInitialBalance(obTransaction.amount);
                setOpeningBalanceTransaction(obTransaction);
            } else {
                setInitialBalance(0);
                setOpeningBalanceTransaction(null);
            }
        } else {
            setName('');
            setInitialBalance(0);
            setOpeningBalanceTransaction(null);
        }
    }
  }, [supplierToEdit, isEditMode, isOpen, state.tabBookTransactions]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (isEditMode && supplierToEdit) {
      // 1. Update supplier name if changed
      if (supplierToEdit.name !== name) {
        dispatch({ type: 'UPDATE_SUPPLIER', payload: { ...supplierToEdit, name } });
      }
      
      const newBalance = Number(initialBalance) || 0;
      
      if (openingBalanceTransaction) {
        if (newBalance !== 0) {
          // Update existing OB transaction if amount changed
          if (openingBalanceTransaction.amount !== newBalance) {
            dispatch({
              type: 'UPDATE_TAB_TRANSACTION',
              payload: { ...openingBalanceTransaction, amount: newBalance }
            });
          }
        } else {
          // Delete existing OB transaction if new balance is 0
          dispatch({
            type: 'DELETE_TAB_TRANSACTION',
            payload: openingBalanceTransaction
          });
        }
      } else if (newBalance !== 0) {
        // Create new OB transaction if one didn't exist
        const newTransaction: TabBookTransaction = {
          id: `t_ob_${new Date().getTime()}`,
          supplierId: supplierToEdit.id,
          date: new Date().toISOString().split('T')[0],
          description: 'Opening Balance',
          amount: newBalance,
        };
        dispatch({ type: 'ADD_TAB_TRANSACTION', payload: newTransaction });
      }
    } else {
      // Add new supplier
      const newSupplier: Supplier = {
        id: `s_${new Date().getTime()}`,
        name,
        balance: 0 // Will be updated by the transaction
      };
      dispatch({ type: 'ADD_SUPPLIER', payload: newSupplier });

      const newBalance = Number(initialBalance) || 0;
      if (newBalance !== 0) {
        const newTransaction: TabBookTransaction = {
          id: `t_ob_${new Date().getTime()}`,
          supplierId: newSupplier.id,
          date: new Date().toISOString().split('T')[0],
          description: 'Opening Balance',
          amount: newBalance
        };
        dispatch({ type: 'ADD_TAB_TRANSACTION', payload: newTransaction });
      }
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
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Initial Balance ($)</label>
                <input type="number" step="0.01" value={initialBalance} onChange={e => setInitialBalance(Number(e.target.value))} className={inputStyles} />
                <p className="text-xs text-slate-500 mt-2 p-3 bg-slate-50 rounded-md">
                    Set an opening balance. <br/>
                    Enter a <strong className="text-red-600 font-semibold">positive</strong> value if you owe the supplier. <br/>
                    Enter a <strong className="text-green-600 font-semibold">negative</strong> value if the supplier owes you (credit/pre-payment).
                </p>
            </div>
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
