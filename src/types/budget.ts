export interface BudgetIncomeItem {
  id: string;
  subcategory_id: string;
  subcategory_name: string;
  subcategory_icon: string;
  category_id: string;
  category_name: string;
  category_icon_round: string;
  budgeted_amount: number;
}

export interface BudgetSubcategory {
  id: string;
  subcategory_id: string;
  subcategory_name: string;
  subcategory_icon: string;
  budgeted_amount: number;
}

export interface BudgetExpenseCategory {
  category_id: string;
  category_name: string;
  category_icon_round: string;
  total_budgeted: number;
  subcategories: BudgetSubcategory[];
}

export interface BudgetSummaryResponse {
  budget_id: string;
  budget_name: string;
  total_budgeted_income: string;
  total_budgeted_expenses: string;
  remaining_to_budget: string;
  is_over_budget: boolean;
  expense_breakdown: BudgetExpenseCategory[];
  income_breakdown: BudgetIncomeItem[];
}

// Types for available expense subcategories endpoint
export interface AvailableSubcategory {
  id: string;
  name: string;
  icon_round: string;
}

export interface AvailableCategory {
  category_id: string;
  category_name: string;
  category_icon: string;
  subcategories: AvailableSubcategory[];
}

export interface AvailableSubcategoriesResponse {
  budget_id: string;
  budget_name: string;
  available_subcategories: AvailableCategory[];
}

// Types for creating budgeted items
export interface CreateBudgetedItemRequest {
  budget_id: string;
  type: "EXPENSE" | "INCOME";
  subcategory_id: string;
  amount: string;
}

export interface CreateBudgetedItemResponse {
  id: string;
  budget: {
    id: string;
    name: string;
    is_active: boolean;
  };
  type: "EXPENSE" | "INCOME";
  subcategory: {
    id: string;
    name: string;
    category_name: string;
    category_id: string;
  };
  amount: string;
}
