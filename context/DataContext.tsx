
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { PoultryCategory, FeedStock, FarmRecord, RecordType, FeedPurchaseRecord, PoultryCountChangeRecord, CalendarTask } from '../types';

interface AppState {
  farmName: string;
  poultry: PoultryCategory[];
  feed: FeedStock;
  records: FarmRecord[];
  tasks: CalendarTask[];
}

type Action = 
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
  | { type: 'DELETE_TASK', payload: string }; // id

const initialState: AppState = {
  farmName: 'Green Acre Poultry Farm',
  poultry: [
    { id: '1', name: 'Broilers', count: 1250 },
    { id: '2', name: 'Layers', count: 800 },
    { id: '3', name: 'Chicks', count: 450 },
    { id: '4', name: 'Turkeys', count: 150 },
  ],
  feed: {
    total: 2500, // kg
    dailyConsumption: 120, // kg
  },
  records: [
    {
      id: 'v1',
      type: RecordType.Vaccination,
      date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0],
      vaccineType: 'Newcastle B1',
      birdsVaccinated: 450,
      nextDueDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString().split('T')[0],
    },
    {
      id: 'f1',
      type: RecordType.FeedPurchase,
      date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0],
      supplier: 'FarmPro Feeds',
      amount: 1000,
      cost: 450,
    },
     {
      id: 'v2',
      type: RecordType.Vaccination,
      date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
      vaccineType: 'Infectious Bronchitis',
      birdsVaccinated: 1250,
      nextDueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
    },
  ],
  tasks: [
    {
      id: 't1',
      date: new Date().toISOString().split('T')[0],
      title: 'Clean the main coop',
      description: 'Full cleanout, change litter, and disinfect.',
      completed: false,
    },
    {
      id: 't2',
      date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
      title: 'Order new batch of feed',
      description: 'Order 1500kg of grower feed.',
      completed: false,
    },
     {
      id: 't3',
      date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
      title: 'Repair fence on west pasture',
      completed: true,
    },
  ],
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
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
    default:
      return state;
  }
};

const DataContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

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
