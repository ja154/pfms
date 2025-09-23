import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { PoultryCategory, FeedStock, FarmRecord, RecordType, FeedPurchaseRecord, PoultryCountChangeRecord, CalendarTask, Supplier, TabBookTransaction } from '../types';

interface AppState {
  farmName: string;
  poultry: PoultryCategory[];
  feed: FeedStock;
  records: FarmRecord[];
  tasks: CalendarTask[];
  suppliers: Supplier[];
  tabBookTransactions: TabBookTransaction[];
}

type Action = 
  | { type: 'REPLACE_STATE'; payload: AppState }
  | { type: 'ADD_RECORD'; payload: FarmRecord }
  | { type: 'EDIT_RECORD', payload: FarmRecord }
  | { type: 'DELETE_RECORD', payload: string } // id
  | { type: 'ADD_POULTRY_CATEGORY', payload: PoultryCategory }
  | { type: 'UPDATE_POULTRY_CATEGORY', payload: PoultryCategory }
  | { type: 'DELETE_POULTRY_CATEGORY', payload: string } // id
  | { type: 'UPDATE_FEED'; payload: Partial<FeedStock> }
  | { type: 'UPDATE_FARM_NAME', payload: string }
  | { type: 'ADD_TASK', payload: CalendarTask }
  | { type: 'UPDATE_TASK', payload: CalendarTask }
  | { type: 'DELETE_TASK', payload: string } // id
  | { type: 'ADD_SUPPLIER', payload: Supplier }
  | { type: 'UPDATE_SUPPLIER', payload: Supplier }
  | { type: 'DELETE_SUPPLIER', payload: string } // id
  | { type: 'ADD_TAB_TRANSACTION', payload: TabBookTransaction }
  | { type: 'UPDATE_TAB_TRANSACTION', payload: TabBookTransaction }
  | { type: 'DELETE_TAB_TRANSACTION', payload: TabBookTransaction }
  | { type: 'ADD_BULK_TAB_TRANSACTIONS', payload: TabBookTransaction[] };

const defaultInitialState: AppState = {
  farmName: 'My Frass Farm',
  poultry: [],
  feed: {
    total: 0, // kg
    dailyConsumption: 0, // kg
  },
  records: [],
  tasks: [],
  suppliers: [],
  tabBookTransactions: [],
};

const LOCAL_STORAGE_KEY = 'frassFarmManagementData';

// Function to load state from localStorage
const loadState = (): AppState => {
    try {
        const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (serializedState === null) {
            return defaultInitialState;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error("Error loading state from localStorage:", err);
        return defaultInitialState;
    }
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'REPLACE_STATE':
        return action.payload;
    case 'UPDATE_FARM_NAME':
      return { ...state, farmName: action.payload };
    case 'ADD_RECORD': {
      const newRecord = action.payload;
      const newRecords = [newRecord, ...state.records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      let newState = { ...state, records: newRecords };

      if (newRecord.type === RecordType.FeedPurchase) {
          newState.feed = { ...state.feed, total: state.feed.total + (newRecord as FeedPurchaseRecord).amount };
      } else if (newRecord.type === RecordType.PoultryCountChange) {
          const changeRecord = newRecord as PoultryCountChangeRecord;
          const change = changeRecord.changeType === 'addition' ? changeRecord.changeAmount : -changeRecord.changeAmount;
          newState.poultry = state.poultry.map(p => 
              p.id === changeRecord.poultryCategoryId 
                  ? { ...p, count: Math.max(0, p.count + change) } 
                  : p
          );
      }
      return newState;
    }
    case 'EDIT_RECORD': {
      const updatedRecord = action.payload;
      const originalRecord = state.records.find(r => r.id === updatedRecord.id);

      if (!originalRecord) return state;

      let tempPoultry = [...state.poultry];

      // Revert old record's side effect
      if (originalRecord.type === RecordType.PoultryCountChange) {
        const changeRecord = originalRecord as PoultryCountChangeRecord;
        const change = changeRecord.changeType === 'addition' ? changeRecord.changeAmount : -changeRecord.changeAmount;
        tempPoultry = tempPoultry.map(p => 
          p.id === changeRecord.poultryCategoryId 
            ? { ...p, count: Math.max(0, p.count - change) } 
            : p
        );
      }
      
      // Apply new record's side effect
      if (updatedRecord.type === RecordType.PoultryCountChange) {
        const changeRecord = updatedRecord as PoultryCountChangeRecord;
        const change = changeRecord.changeType === 'addition' ? changeRecord.changeAmount : -changeRecord.changeAmount;
        tempPoultry = tempPoultry.map(p => 
          p.id === changeRecord.poultryCategoryId 
            ? { ...p, count: Math.max(0, p.count + change) } 
            : p
        );
      }

      return {
        ...state,
        poultry: tempPoultry,
        records: state.records.map(r => r.id === updatedRecord.id ? updatedRecord : r)
      };
    }
    case 'DELETE_RECORD': {
       const recordIdToDelete = action.payload;
        const recordToDelete = state.records.find(r => r.id === recordIdToDelete);
        if (!recordToDelete) return state;

        let newState = { ...state };
        
        // Revert side effects
        if (recordToDelete.type === RecordType.PoultryCountChange) {
            const changeRecord = recordToDelete as PoultryCountChangeRecord;
            const change = changeRecord.changeType === 'addition' ? changeRecord.changeAmount : -changeRecord.changeAmount;
             newState.poultry = state.poultry.map(p => 
                p.id === changeRecord.poultryCategoryId 
                    ? { ...p, count: Math.max(0, p.count - change) } // Reverse the change
                    : p
            );
        }
       
        newState.records = state.records.filter(r => r.id !== recordIdToDelete);
        return newState;
    }
    case 'ADD_POULTRY_CATEGORY':
        return { ...state, poultry: [...state.poultry, action.payload] };
    case 'UPDATE_POULTRY_CATEGORY':
        return { ...state, poultry: state.poultry.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_POULTRY_CATEGORY':
        return { ...state, poultry: state.poultry.filter(p => p.id !== action.payload) };
    case 'UPDATE_FEED':
        return { ...state, feed: { ...state.feed, ...action.payload } };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    
    case 'ADD_SUPPLIER':
      return { ...state, suppliers: [...state.suppliers, action.payload] };
    case 'UPDATE_SUPPLIER':
      return { ...state, suppliers: state.suppliers.map(s => s.id === action.payload.id ? { ...s, name: action.payload.name } : s) };
    case 'DELETE_SUPPLIER': {
      const supplierIdToDelete = action.payload;
      return {
        ...state,
        suppliers: state.suppliers.filter(s => s.id !== supplierIdToDelete),
        tabBookTransactions: state.tabBookTransactions.filter(t => t.supplierId !== supplierIdToDelete),
      };
    }
    case 'ADD_TAB_TRANSACTION': {
      const newTransaction = action.payload;
      return {
        ...state,
        tabBookTransactions: [newTransaction, ...state.tabBookTransactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        suppliers: state.suppliers.map(s =>
          s.id === newTransaction.supplierId
            ? { ...s, balance: s.balance + newTransaction.amount }
            : s
        ),
      };
    }
    case 'UPDATE_TAB_TRANSACTION': {
      const updatedTransaction = action.payload;
      const originalTransaction = state.tabBookTransactions.find(t => t.id === updatedTransaction.id);
      if (!originalTransaction) return state;

      const newSuppliers = state.suppliers.map(s => {
        // Case 1: This is the original supplier, and the supplier has been changed.
        // We need to revert the original amount from this supplier.
        if (s.id === originalTransaction.supplierId && originalTransaction.supplierId !== updatedTransaction.supplierId) {
            return { ...s, balance: s.balance - originalTransaction.amount };
        }
        
        // Case 2: This is the transaction's supplier (new or same).
        if (s.id === updatedTransaction.supplierId) {
            // Sub-case 2a: Supplier is the same as before. Apply the net change.
            if (originalTransaction.supplierId === updatedTransaction.supplierId) {
                const netChange = updatedTransaction.amount - originalTransaction.amount;
                return { ...s, balance: s.balance + netChange };
            } else {
                // Sub-case 2b: Supplier is new. Apply the full new amount.
                return { ...s, balance: s.balance + updatedTransaction.amount };
            }
        }

        // Case 3: This supplier is not involved in the change.
        return s;
      });

      return {
        ...state,
        tabBookTransactions: state.tabBookTransactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t),
        suppliers: newSuppliers,
      };
    }
    case 'DELETE_TAB_TRANSACTION': {
      const transactionToDelete = action.payload;
      return {
        ...state,
        tabBookTransactions: state.tabBookTransactions.filter(t => t.id !== transactionToDelete.id),
        suppliers: state.suppliers.map(s =>
          s.id === transactionToDelete.supplierId
            ? { ...s, balance: s.balance - transactionToDelete.amount }
            : s
        ),
      };
    }
    case 'ADD_BULK_TAB_TRANSACTIONS': {
      const newTransactions = action.payload;
      if (newTransactions.length === 0) return state;

      const balanceChanges: { [supplierId: string]: number } = {};
      
      for (const trans of newTransactions) {
          balanceChanges[trans.supplierId] = (balanceChanges[trans.supplierId] || 0) + trans.amount;
      }
      
      return {
          ...state,
          tabBookTransactions: [...newTransactions, ...state.tabBookTransactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          suppliers: state.suppliers.map(s => 
              balanceChanges[s.id]
                  ? { ...s, balance: s.balance + balanceChanges[s.id] }
                  : s
          )
      };
    }
    default:
      return state;
  }
};

const DataContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, loadState());

  // Effect to save state to localStorage whenever it changes
  useEffect(() => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
    } catch (err) {
        console.error("Error saving state to localStorage:", err);
    }
  }, [state]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};