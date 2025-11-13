import type { GroupedTransactionsResponse } from "../types/transaction";
import apiClient from "./api";

/**
 * Fetch grouped transactions for a specific period
 * @param period - Optional period in format YYYY-MM (e.g., "2025-06")
 * @returns Grouped transactions response
 */
export async function getGroupedTransactions(
  period?: string
): Promise<GroupedTransactionsResponse> {
  const params = period ? { period } : {};

  const response = await apiClient.get<GroupedTransactionsResponse>(
    "/transactions/grouped/",
    {
      params
    }
  );
  return response.data;
}

/**
 * Format a Date object to YYYY-MM format for API
 * @param date - Date object to format
 * @returns Formatted period string (e.g., "2025-06")
 */
export function formatPeriodForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}
