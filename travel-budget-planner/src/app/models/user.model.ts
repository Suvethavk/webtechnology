export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  expenses?: Expense[];
  budgets?: Budget[];
}

export interface Budget {
  destination: string;
  duration: number;
  travelers: number;
  accommodation: string;
  food: string;
  activities: string;
  transport: string;
  currency: string;
  costs: any;
  date: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}