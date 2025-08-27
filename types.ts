
export interface PoultryCategory {
  id: string;
  name: string;
  count: number;
}

export interface FeedStock {
  total: number; // in kg
  dailyConsumption: number; // in kg
}

export enum RecordType {
  FeedPurchase = 'Feed Purchase',
  Vaccination = 'Vaccination',
  PoultryCountChange = 'Poultry Count Change',
}

export interface FeedPurchaseRecord {
  id: string;
  type: RecordType.FeedPurchase;
  date: string;
  supplier: string;
  amount: number; // in kg
  cost: number; // in currency
}

export interface VaccinationRecord {
  id: string;
  type: RecordType.Vaccination;
  date: string;
  vaccineType: string;
  birdsVaccinated: number;
  nextDueDate: string;
}

export type PoultryChangeType = 'addition' | 'reduction';
export type PoultryAdditionReason = 'hatching' | 'purchase';
export type PoultryReductionReason = 'sold' | 'died' | 'eaten';
export type PoultryChangeReason = PoultryAdditionReason | PoultryReductionReason;

export interface PoultryCountChangeRecord {
  id:string;
  type: RecordType.PoultryCountChange;
  date: string;
  poultryCategoryId: string;
  poultryCategoryName: string; // Denormalized for easier display
  changeType: PoultryChangeType;
  reason: PoultryChangeReason;
  changeAmount: number; // Always a positive number
}


export type FarmRecord = FeedPurchaseRecord | VaccinationRecord | PoultryCountChangeRecord;

export interface CalendarTask {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  completed: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  balance: number; // Positive: farmer owes supplier. Negative: supplier owes farmer.
}

export interface TabBookTransaction {
  id: string;
  supplierId: string;
  date: string;
  description: string;
  amount: number; // Positive: increases farmer debt. Negative: decreases farmer debt (payment/credit).
}
