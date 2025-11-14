export interface DashboardSummary {
  total_spending: string;
  total_income: string;
  net: string;
}

export interface SubcategoryExpense {
  amount: string;
  subcategory: string;
  subcategory_icon: string;
  budgeted_amount: string;
}

export interface CategoryExpense {
  id: string;
  category: string;
  category_icon_round: string;
  total_spent: number;
  budgeted_amount: number;
  expanded: string;
  expenses: SubcategoryExpense[];
}

export interface DashboardDataResponse {
  summary: DashboardSummary;
  categories: CategoryExpense[];
}
