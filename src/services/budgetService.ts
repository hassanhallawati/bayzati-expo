import type {
  AvailableSubcategoriesResponse,
  BudgetSummaryResponse,
  CreateBudgetedItemRequest,
  CreateBudgetedItemResponse,
} from "../types/budget";
import type { Category } from "../types/category";
import apiClient from "./api";

/**
 * Fetch budget summary data
 * @returns Budget summary including income and expense breakdowns
 */
export async function getBudgetSummary(): Promise<BudgetSummaryResponse> {
  const response = await apiClient.get<BudgetSummaryResponse>(
    "/savings/budget/summary/"
  );
  return response.data;
}

/**
 * Update a budgeted item's amount
 * @param itemId - The ID of the budgeted item to update
 * @param amount - The new amount value
 * @returns Updated budget item object
 */
export async function updateBudgetedItemAmount(
  itemId: string,
  amount: string
): Promise<any> {
  const response = await apiClient.patch(
    `/savings/budgeted-items/${itemId}/`,
    { amount }
  );
  return response.data;
}

/**
 * Delete a budgeted item
 * @param itemId - The ID of the budgeted item to delete
 */
export async function deleteBudgetedItem(itemId: string): Promise<void> {
  await apiClient.delete(`/savings/budgeted-items/${itemId}/`);
}

/**
 * Create a new budgeted item
 * @param data - The budgeted item data including budget_id, type, subcategory_id, and amount
 * @returns Created budgeted item object
 */
export async function createBudgetedItem(
  data: CreateBudgetedItemRequest
): Promise<CreateBudgetedItemResponse> {
  const response = await apiClient.post<CreateBudgetedItemResponse>(
    "/savings/budgeted-items/",
    data
  );
  return response.data;
}

/**
 * Fetch available expense subcategories (not yet budgeted)
 * @returns Categories with only available subcategories, transformed to match Category[] format
 */
export async function fetchAvailableExpenseSubcategories(): Promise<Category[]> {
  const response = await apiClient.get<AvailableSubcategoriesResponse>(
    "/savings/available-subcategories/?type=expense"
  );

  // Transform to match existing Category[] format for CategoryPickerSheet
  return response.data.available_subcategories.map((cat) => ({
    id: cat.category_id,
    name: cat.category_name,
    icon: cat.category_icon,
    subcategories: cat.subcategories.map((sub) => ({
      id: sub.id,
      name: sub.name,
      icon_round: sub.icon_round,
    })),
  }));
}
