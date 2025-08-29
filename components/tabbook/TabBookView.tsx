
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import Card from '../ui/Card';
import { Supplier, TabBookTransaction } from '../../types';
import AddEditSupplierModal from './AddEditSupplierModal';
import AddEditTransactionModal from './AddEditTransactionModal';
import ImportTransactionsModal from './ImportTransactionsModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';


const TabBookView: React.FC = () => {
    const { state, dispatch } = useData();
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [editingTransaction, setEditingTransaction] = useState<TabBookTransaction | null>(null);

    // State for date filtering
    const [dateFilter, setDateFilter] = useState('all');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    // Reset filters when supplier changes
    useEffect(() => {
        setDateFilter('all');
        setCustomStartDate('');
        setCustomEndDate('');
    }, [selectedSupplier]);


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
    
     const filteredTransactions = useMemo(() => {
        const baseTransactions = transactionsForSelectedSupplier;
        if (dateFilter === 'all') {
            return baseTransactions;
        }

        const today = new Date();
        let startFilter: Date;
        let endFilter: Date;

        if (dateFilter === 'thisMonth') {
            startFilter = new Date(today.getFullYear(), today.getMonth(), 1);
            endFilter = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        } else if (dateFilter === 'lastMonth') {
            startFilter = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            endFilter = new Date(today.getFullYear(), today.getMonth(), 0);
        } else if (dateFilter === 'custom') {
            // Use string comparison for custom YYYY-MM-DD dates to avoid timezone issues
            let filtered = baseTransactions;
            if (customStartDate) {
                filtered = filtered.filter(t => t.date >= customStartDate);
            }
            if (customEndDate) {
                filtered = filtered.filter(t => t.date <= customEndDate);
            }
            return filtered;
        } else {
             return baseTransactions;
        }

        startFilter.setHours(0, 0, 0, 0);
        endFilter.setHours(23, 59, 59, 999);

        return baseTransactions.filter(t => {
            // Dates are stored as YYYY-MM-DD strings. new Date() on this string creates a UTC date.
            // Our filter dates are created in the local timezone. Comparison should be fine.
            const transactionDate = new Date(t.date);
            return transactionDate >= startFilter && transactionDate <= endFilter;
        });

    }, [transactionsForSelectedSupplier, dateFilter, customStartDate, customEndDate]);


    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    const sortedSuppliersByBalance = useMemo(() => {
        return [...state.suppliers].sort((a, b) => b.balance - a.balance);
    }, [state.suppliers]);

    const sortedSuppliersByName = useMemo(() => {
        return [...state.suppliers].sort((a, b) => a.name.localeCompare(b.name));
    }, [state.suppliers]);
    
    const FilterButton: React.FC<{label: string; filterValue: string}> = ({ label, filterValue }) => {
        const isActive = dateFilter === filterValue;
        return (
            <button
                onClick={() => setDateFilter(filterValue)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    isActive ? 'bg-brand-green-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                {label}
            </button>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-brand-green-900">Tab Book</h2>
                <div className="flex flex-wrap gap-2">
                     <button onClick={openAddSupplierModal} className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-glow-blue transition-all duration-300">
                        Add Supplier
                    </button>
                    <button onClick={() => setIsImportModalOpen(true)} className="px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 hover:shadow-glow-purple transition-all duration-300">
                        Import Transactions
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
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.75rem',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                            }}
                        />
                        <Bar dataKey="balance" name="Balance" radius={[0, 4, 4, 0]}>
                            {sortedSuppliersByBalance.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.balance > 0 ? '#ef4444' : entry.balance < 0 ? '#16a34a' : '#6b7280'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Suppliers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedSuppliersByName.map(supplier => (
                        <div key={supplier.id} onClick={() => setSelectedSupplier(supplier)}
                            className={`p-4 rounded-lg cursor-pointer border-l-4 transition-all duration-200 ${
                                selectedSupplier?.id === supplier.id
                                    ? 'bg-brand-green-100 border-brand-green-600 shadow-lg scale-105'
                                    : `bg-white hover:bg-gray-50 hover:shadow-md ${supplier.balance > 0 ? 'border-red-400' : supplier.balance < 0 ? 'border-green-400' : 'border-gray-300'}`
                            }`}>
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-gray-800 pr-2">{supplier.name}</span>
                                <button onClick={(e) => { e.stopPropagation(); openEditSupplierModal(supplier)}} className="text-xs text-blue-600 hover:underline flex-shrink-0">Edit</button>
                            </div>
                            <p className={`text-xl font-bold mt-2 ${supplier.balance > 0 ? 'text-red-600' : supplier.balance < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                                {formatCurrency(supplier.balance)}
                            </p>
                            <p className="text-xs text-gray-500">
                                {supplier.balance > 0 ? 'You Owe' : supplier.balance < 0 ? 'Owes You' : 'Settled'}
                            </p>
                        </div>
                    ))}
                </div>
            </Card>
            
            {selectedSupplier && (
                 <Card className="animate-in fade-in-0 duration-500">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-lg font-semibold text-gray-700">
                            {`Transaction History for ${selectedSupplier.name}`}
                         </h3>
                         <button 
                            onClick={() => setSelectedSupplier(null)} 
                            className="text-sm font-medium text-gray-500 hover:text-gray-800 flex items-center gap-1"
                            aria-label="Close transaction history"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                             Close
                         </button>
                     </div>

                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-gray-600 mr-2">Filter:</span>
                            <FilterButton label="All Time" filterValue="all" />
                            <FilterButton label="This Month" filterValue="thisMonth" />
                            <FilterButton label="Last Month" filterValue="lastMonth" />
                            <FilterButton label="Custom" filterValue="custom" />
                        </div>
                        {dateFilter === 'custom' && (
                            <div className="mt-3 flex flex-wrap items-center gap-4 animate-in fade-in-0 duration-300">
                                <div className="flex-1 min-w-[150px]">
                                    <label htmlFor="start-date" className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                                    <input id="start-date" type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="w-full p-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-green-500"/>
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <label htmlFor="end-date" className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                                    <input id="end-date" type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="w-full p-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-green-500"/>
                                </div>
                            </div>
                        )}
                    </div>

                     <div className="overflow-x-auto">
                        {filteredTransactions.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="border-b-2 border-gray-100 bg-gray-50">
                                    <tr>
                                        <th className="p-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="p-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="p-3 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                                        <th className="p-3 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map(t => (
                                        <tr key={t.id} className="border-b border-gray-100 hover:bg-brand-green-50/50 transition-colors">
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
                        ) : <p className="text-center text-gray-500 py-12">No transactions found for this supplier in the selected date range.</p>
                        }
                     </div>
                </Card>
            )}
            
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

            <ImportTransactionsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
            />
        </div>
    );
};

export default TabBookView;