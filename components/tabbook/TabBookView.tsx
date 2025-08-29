import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import Card from '../ui/Card';
import { Supplier, TabBookTransaction } from '../../types';
import AddEditSupplierModal from './AddEditSupplierModal';
import AddEditTransactionModal from './AddEditTransactionModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';


const TabBookView: React.FC = () => {
    const { state, dispatch } = useData();
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [editingTransaction, setEditingTransaction] = useState<TabBookTransaction | null>(null);

    const openAddSupplierModal = () => {
        setEditingSupplier(null);
        setIsSupplierModalOpen(true);
    };

    const openEditSupplierModal = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setIsSupplierModalOpen(true);
    };
    
    const openAddTransactionModal = () => {
        setEditingTransaction(null);
        setIsTransactionModalOpen(true);
    };

    const openEditTransactionModal = (transaction: TabBookTransaction) => {
        setEditingTransaction(transaction);
        setIsTransactionModalOpen(true);
    };
    
    const handleDeleteTransaction = (transaction: TabBookTransaction) => {
        if(window.confirm('Are you sure you want to delete this transaction? This will update the supplier balance.')){
            dispatch({ type: 'DELETE_TAB_TRANSACTION', payload: transaction });
        }
    }

    const transactionsForSelectedSupplier = useMemo(() => {
        if (!selectedSupplier) return [];
        return state.tabBookTransactions
            .filter(t => t.supplierId === selectedSupplier.id)
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [state.tabBookTransactions, selectedSupplier]);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    const sortedSuppliersByBalance = useMemo(() => {
        return [...state.suppliers].sort((a, b) => b.balance - a.balance);
    }, [state.suppliers]);

    const sortedSuppliersByName = useMemo(() => {
        return [...state.suppliers].sort((a, b) => a.name.localeCompare(b.name));
    }, [state.suppliers]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-brand-green-900">Tab Book</h2>
                <div className="flex gap-2">
                     <button onClick={openAddSupplierModal} className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-glow-blue transition-all duration-300">
                        Add Supplier
                    </button>
                    <button onClick={openAddTransactionModal} className="px-5 py-2.5 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 hover:shadow-glow-green transition-all duration-300">
                        Add Transaction
                    </button>
                </div>
            </div>
            
             <Card>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Supplier Balances Overview</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={sortedSuppliersByBalance}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                        <YAxis dataKey="name" type="category" width={120} interval={0} />
                        <Tooltip
                            formatter={(value) => formatCurrency(value as number)}
                            cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                            contentStyle={{
                                background: 'white',
                                border: '1px solid #dcfce7',
                                borderRadius: '0.5rem',
                            }}
                        />
                        <Bar dataKey="balance" name="Balance">
                            {sortedSuppliersByBalance.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.balance > 0 ? '#ef4444' : entry.balance < 0 ? '#22c55e' : '#6b7280'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 h-[600px] flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Suppliers</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                        {sortedSuppliersByName.map(supplier => (
                            <div key={supplier.id} onClick={() => setSelectedSupplier(supplier)}
                                className={`p-3 rounded-lg cursor-pointer border-l-4 transition-colors ${
                                    selectedSupplier?.id === supplier.id
                                        ? 'bg-brand-green-100 border-brand-green-500'
                                        : `bg-white hover:bg-gray-50 ${supplier.balance > 0 ? 'border-red-400' : supplier.balance < 0 ? 'border-green-400' : 'border-gray-300'}`
                                }`}>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-800">{supplier.name}</span>
                                    <button onClick={(e) => { e.stopPropagation(); openEditSupplierModal(supplier)}} className="text-xs text-blue-600 hover:underline">Edit</button>
                                </div>
                                <p className={`text-base font-bold ${supplier.balance > 0 ? 'text-red-600' : supplier.balance < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                                    {formatCurrency(supplier.balance)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {supplier.balance > 0 ? 'You Owe' : supplier.balance < 0 ? 'Owes You' : 'Settled'}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
                
                <Card className="lg:col-span-2 h-[600px] flex flex-col">
                     <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        {selectedSupplier ? `History for ${selectedSupplier.name}` : 'Select a Supplier'}
                     </h3>
                     <div className="flex-1 overflow-y-auto">
                        {selectedSupplier ? (
                            transactionsForSelectedSupplier.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="border-b-2 border-brand-brown-100 sticky top-0 bg-white">
                                        <tr>
                                            <th className="p-3 text-sm font-semibold text-gray-500 uppercase">Date</th>
                                            <th className="p-3 text-sm font-semibold text-gray-500 uppercase">Description</th>
                                            <th className="p-3 text-sm font-semibold text-gray-500 uppercase text-right">Amount</th>
                                            <th className="p-3 text-sm font-semibold text-gray-500 uppercase text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-brown-100">
                                        {transactionsForSelectedSupplier.map(t => (
                                            <tr key={t.id}>
                                                <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</td>
                                                <td className="p-3 text-sm text-gray-800">{t.description}</td>
                                                <td className={`p-3 text-sm font-semibold text-right ${t.amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}
                                                </td>
                                                <td className="p-3 text-center text-xs">
                                                    <button onClick={() => openEditTransactionModal(t)} className="text-blue-600 hover:underline mr-2">Edit</button>
                                                    <button onClick={() => handleDeleteTransaction(t)} className="text-red-600 hover:underline">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <p className="text-center text-gray-500 pt-16">No transactions found for this supplier.</p>
                        ) : (
                            <p className="text-center text-gray-500 pt-16">Select a supplier from the list to view their transaction history.</p>
                        )}
                     </div>
                </Card>
            </div>
            
            <AddEditSupplierModal 
                isOpen={isSupplierModalOpen}
                onClose={() => setIsSupplierModalOpen(false)}
                supplierToEdit={editingSupplier}
            />

            <AddEditTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
                transactionToEdit={editingTransaction}
            />
        </div>
    );
};

export default TabBookView;