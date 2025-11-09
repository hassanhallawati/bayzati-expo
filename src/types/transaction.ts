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
}

export interface GroupedTransaction {
  date: string;
  label: string;
  net_sign: string;
  total_amount: string;
  transactions: Transaction[];
}

export type GroupedTransactionsResponse = GroupedTransaction[];
