
import React, { useState, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { TabBookTransaction } from '../../types';
import Modal from '../ui/Modal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ValidationStatus = 'idle' | 'processing' | 'success' | 'error';

const ImportTransactionsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const { state, dispatch } = useData();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [status, setStatus] = useState<ValidationStatus>('idle');
    const [errors, setErrors] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStatus('idle');
        setErrors([]);
        setSuccessMessage('');
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleDownloadTemplate = () => {
        const header = "date,description,amount,supplier_name\n";
        const example1 = "2024-05-20,Purchase of 10 feed bags,150.75,FarmPro Feeds\n";
        const example2 = "2024-05-21,Payment for invoice #123,-100,Local Grains Co-op\n";
        const csvContent = "data:text/csv;charset=utf-8," + header + example1 + example2;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transaction_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = useCallback(() => {
        if (!selectedFile) return;

        setStatus('processing');
        setErrors([]);
        setSuccessMessage('');

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text !== 'string') {
                setStatus('error');
                setErrors(['Could not read the file.']);
                return;
            }

            const validationErrors: string[] = [];
            const newTransactions: TabBookTransaction[] = [];
            const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
            
            if (lines.length < 2) {
                setStatus('error');
                setErrors(['CSV file is empty or contains only a header.']);
                return;
            }
            
            const header = lines[0].split(',').map(h => h.trim().toLowerCase());
            const requiredHeaders = ['date', 'description', 'amount', 'supplier_name'];
            if (!requiredHeaders.every(h => header.includes(h))) {
                 setStatus('error');
                setErrors([`Invalid CSV header. Must contain: ${requiredHeaders.join(', ')}`]);
                return;
            }

            const supplierMap = new Map(state.suppliers.map(s => [s.name.toLowerCase(), s.id]));

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',');
                const rowNum = i + 1;
                
                const date = values[0]?.trim();
                const description = values[1]?.trim();
                const amountStr = values[2]?.trim();
                const supplierName = values[3]?.trim();

                if (!date || !description || !amountStr || !supplierName) {
                    validationErrors.push(`Row ${rowNum}: Contains missing values.`);
                    continue;
                }
                
                if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                    validationErrors.push(`Row ${rowNum}: Invalid date format for "${date}". Use YYYY-MM-DD.`);
                }

                const amount = parseFloat(amountStr);
                if (isNaN(amount)) {
                    validationErrors.push(`Row ${rowNum}: Amount "${amountStr}" is not a valid number.`);
                }
                
                const supplierId = supplierMap.get(supplierName.toLowerCase());
                if (!supplierId) {
                    validationErrors.push(`Row ${rowNum}: Supplier "${supplierName}" not found. Please add them first or check for typos.`);
                }

                if (validationErrors.length === 0) {
                    newTransactions.push({
                        id: `imp_${new Date().getTime()}_${i}`,
                        date,
                        description,
                        amount,
                        supplierId: supplierId!,
                    });
                }
            }

            if (validationErrors.length > 0) {
                setStatus('error');
                setErrors(validationErrors);
            } else {
                dispatch({ type: 'ADD_BULK_TAB_TRANSACTIONS', payload: newTransactions });
                setStatus('success');
                setSuccessMessage(`Successfully imported ${newTransactions.length} transactions!`);
                setSelectedFile(null);
            }
        };
        
        reader.readAsText(selectedFile);
    }, [selectedFile, state.suppliers, dispatch]);

    const handleClose = () => {
        setSelectedFile(null);
        setStatus('idle');
        setErrors([]);
        setSuccessMessage('');
        onClose();
    }


    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Import Transactions from CSV">
            <div className="p-6 space-y-6">
                
                {/* Step 1: Template */}
                <div className="space-y-2">
                    <h3 className="text-md font-semibold text-gray-800">1. Download and Prepare Your File</h3>
                    <p className="text-sm text-gray-600">Download our CSV template to ensure your data is in the correct format. The <code className="bg-gray-200 p-1 rounded text-xs">supplier_name</code> must exactly match an existing supplier.</p>
                    <button onClick={handleDownloadTemplate} className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors text-sm">Download CSV Template</button>
                </div>

                {/* Step 2: Upload */}
                <div className="space-y-2">
                    <h3 className="text-md font-semibold text-gray-800">2. Upload Your CSV File</h3>
                     <input 
                        type="file" 
                        accept=".csv" 
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-green-50 file:text-brand-green-700 hover:file:bg-brand-green-100"
                    />
                     {selectedFile && <p className="text-sm text-gray-500">Selected: {selectedFile.name}</p>}
                </div>

                {/* Feedback Section */}
                {status !== 'idle' && (
                    <div className="p-4 rounded-lg">
                        {status === 'processing' && <p className="text-gray-600">Processing and validating file...</p>}
                        {status === 'success' && (
                            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="font-semibold text-green-700">{successMessage}</p>
                            </div>
                        )}
                        {status === 'error' && (
                             <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="font-bold text-red-700 mb-2">Validation Failed</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-red-600 max-h-40 overflow-y-auto">
                                    {errors.map((error, index) => <li key={index}>{error}</li>)}
                                </ul>
                             </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg border-t">
              <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                {status === 'success' ? 'Done' : 'Cancel'}
              </button>
              <button 
                type="button" 
                onClick={handleImport} 
                disabled={!selectedFile || status === 'processing'}
                className="px-5 py-2.5 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 hover:shadow-glow-green transition-all duration-300 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed">
                {status === 'processing' ? 'Importing...' : 'Import'}
              </button>
            </div>
        </Modal>
    );
};

export default ImportTransactionsModal;
