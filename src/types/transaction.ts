export interface Transaction {
  id: string;
  type: "EXPENSE" | "INCOME";
  merchant: string;
  category: string;
  subcategory: string;
  category_icon: string;
  category_icon_round: string;
  amount: string;
  notes: string;
  sign: string;
  color: string;
  transaction_date_time: string; // Format: ISO 8601 (e.g., "2025-11-14T00:00:00+04:00" or "2025-11-13T20:00:00Z")
}

export interface GroupedTransaction {
  date: string;
  label: string;
  net_sign: string;
  total_amount: string;
  transactions: Transaction[];
}

export type GroupedTransactionsResponse = GroupedTransaction[];
