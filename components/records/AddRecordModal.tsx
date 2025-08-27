
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { RecordType, FarmRecord, FeedPurchaseRecord, VaccinationRecord, PoultryCountChangeRecord, PoultryChangeType, PoultryChangeReason } from '../../types';
import Modal from '../ui/Modal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordToEdit?: FarmRecord | null;
}

const AddRecordModal: React.FC<ModalProps> = ({ isOpen, onClose, recordToEdit }) => {
  const { state, dispatch } = useData();
  const isEditMode = !!recordToEdit;

  // Common fields
  const [recordType, setRecordType] = useState<RecordType>(RecordType.FeedPurchase);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Feed Purchase fields
  const [supplier, setSupplier] = useState('');
  const [amount, setAmount] = useState(0);
  const [cost, setCost] = useState(0);

  // Vaccination fields
  const [vaccineType, setVaccineType] = useState('');
  const [birdsVaccinated, setBirdsVaccinated] = useState(0);
  const [nextDueDate, setNextDueDate] = useState('');

  // Poultry Count Change fields
  const [poultryCategoryId, setPoultryCategoryId] = useState(state.poultry[0]?.id || '');
  const [changeType, setChangeType] = useState<PoultryChangeType>('reduction');
  const [reason, setReason] = useState<PoultryChangeReason>('sold');
  const [changeAmount, setChangeAmount] = useState(0);
  
  const inputStyles = "w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-green-500 transition-shadow";


  const reasonOptions = changeType === 'addition'
    ? [{ value: 'hatching', label: 'Hatching' }, { value: 'purchase', label: 'Purchase' }]
    : [{ value: 'sold', label: 'Sold' }, { value: 'died', label: 'Died' }, { value: 'eaten', label: 'Eaten' }];

  useEffect(() => {
    // Reset reason when changeType changes to prevent invalid state
    if (changeType === 'addition') {
      setReason('hatching');
    } else {
      setReason('sold');
    }
  }, [changeType]);

  useEffect(() => {
    const resetForm = () => {
      setRecordType(RecordType.FeedPurchase);
      setDate(new Date().toISOString().split('T')[0]);
      setSupplier('');
      setAmount(0);
      setCost(0);
      setVaccineType('');
      setBirdsVaccinated(0);
      setNextDueDate('');
      setPoultryCategoryId(state.poultry[0]?.id || '');
      setChangeType('reduction');
      setReason('sold');
      setChangeAmount(0);
    };

    if (isOpen) {
      if (isEditMode) {
        setRecordType(recordToEdit.type);
        setDate(recordToEdit.date);
        if (recordToEdit.type === RecordType.FeedPurchase) {
          const rec = recordToEdit as FeedPurchaseRecord;
          setSupplier(rec.supplier); setAmount(rec.amount); setCost(rec.cost);
        } else if (recordToEdit.type === RecordType.Vaccination) {
          const rec = recordToEdit as VaccinationRecord;
          setVaccineType(rec.vaccineType); setBirdsVaccinated(rec.birdsVaccinated); setNextDueDate(rec.nextDueDate);
        } else if (recordToEdit.type === RecordType.PoultryCountChange) {
          const rec = recordToEdit as PoultryCountChangeRecord;
          setPoultryCategoryId(rec.poultryCategoryId); setChangeType(rec.changeType); setReason(rec.reason); setChangeAmount(rec.changeAmount);
        }
      } else {
        resetForm();
      }
    }
  }, [recordToEdit, isEditMode, isOpen, state.poultry]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let recordData: FarmRecord;

    if (recordType === RecordType.FeedPurchase) {
        recordData = {
            id: isEditMode ? recordToEdit.id : `f_${new Date().getTime()}`,
            type: RecordType.FeedPurchase, date, supplier, amount, cost
        };
    } else if (recordType === RecordType.Vaccination) {
         recordData = {
            id: isEditMode ? recordToEdit.id : `v_${new Date().getTime()}`,
            type: RecordType.Vaccination, date, vaccineType, birdsVaccinated, nextDueDate
        };
    } else { // PoultryCountChange
        const category = state.poultry.find(p => p.id === poultryCategoryId);
        if (!category) return; // Should not happen with dropdown
        recordData = {
            id: isEditMode ? recordToEdit.id : `pcc_${new Date().getTime()}`,
            type: RecordType.PoultryCountChange, date, poultryCategoryId,
            poultryCategoryName: category.name, // Denormalize name
            changeType, reason, changeAmount,
        }
    }

    dispatch({ type: isEditMode ? 'EDIT_RECORD' : 'ADD_RECORD', payload: recordData });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Record' : 'Add New Record'}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
              <select value={recordType} onChange={e => setRecordType(e.target.value as RecordType)} disabled={isEditMode} className={`${inputStyles} disabled:bg-gray-100`}>
                <option value={RecordType.FeedPurchase}>Feed Purchase</option>
                <option value={RecordType.Vaccination}>Vaccination</option>
                <option value={RecordType.PoultryCountChange}>Poultry Count Change</option>
              </select>
            </div>
             <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={inputStyles} />
            </div>

            {recordType === RecordType.FeedPurchase && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} required className={inputStyles} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (kg)</label>
                    <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required min="0" className={inputStyles} />
                   </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost ($)</label>
                    <input type="number" value={cost} onChange={e => setCost(Number(e.target.value))} required min="0" className={inputStyles} />
                   </div>
                </div>
              </div>
            )}
            
            {recordType === RecordType.Vaccination && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vaccine Type</label>
                  <input type="text" value={vaccineType} onChange={e => setVaccineType(e.target.value)} required className={inputStyles} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Birds Vaccinated</label>
                    <input type="number" value={birdsVaccinated} onChange={e => setBirdsVaccinated(Number(e.target.value))} required min="0" className={inputStyles} />
                   </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
                    <input type="date" value={nextDueDate} onChange={e => setNextDueDate(e.target.value)} required className={inputStyles} />
                   </div>
                </div>
              </div>
            )}

            {recordType === RecordType.PoultryCountChange && (
                 <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Poultry Category</label>
                        <select value={poultryCategoryId} onChange={e => setPoultryCategoryId(e.target.value)} required className={inputStyles}>
                           {state.poultry.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Change Type</label>
                            <select value={changeType} onChange={e => setChangeType(e.target.value as PoultryChangeType)} required className={inputStyles}>
                                <option value="reduction">Reduction</option>
                                <option value="addition">Addition</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                            <select value={reason} onChange={e => setReason(e.target.value as PoultryChangeReason)} required className={inputStyles}>
                                {reasonOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Birds</label>
                        <input type="number" value={changeAmount} onChange={e => setChangeAmount(Number(e.target.value))} required min="1" className={inputStyles} />
                    </div>
                 </div>
            )}

          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 hover:shadow-glow-green transition-all duration-300">Save Record</button>
          </div>
        </form>
    </Modal>
  );
};

export default AddRecordModal;