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

/**
 * Format a Date object to YYYY-MM-DD format for API
 * @param date - Date object to format
 * @returns Formatted date string (e.g., "2025-11-14")
 */
export function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface CreateTransactionExpenseRequest {
  transaction_type: "EXPENSE";
  merchant_name: string;
  subcategory: string;
  transaction_amount: string;
  transaction_date_time: string;
  notes?: string;
}

interface CreateTransactionIncomeRequest {
  transaction_type: "INCOME";
  subcategory: string;
  transaction_amount: string;
  transaction_date_time: string;
  notes?: string;
}

type CreateTransactionRequest = CreateTransactionExpenseRequest | CreateTransactionIncomeRequest;

interface UpdateTransactionExpenseRequest {
  transaction_type: "EXPENSE";
  merchant_name: string;
  subcategory: string;
  transaction_amount: string;
  transaction_date_time: string;
  notes?: string;
}

interface UpdateTransactionIncomeRequest {
  transaction_type: "INCOME";
  subcategory: string;
  transaction_amount: string;
  transaction_date_time: string;
  notes?: string;
}

type UpdateTransactionRequest = UpdateTransactionExpenseRequest | UpdateTransactionIncomeRequest;

/**
 * Create a new transaction
 * @param data - Transaction data
 * @returns Created transaction response
 */
export async function createTransaction(
  data: CreateTransactionRequest
): Promise<any> {
  const response = await apiClient.post("/transactions/create/", data);
  return response.data;
}

/**
 * Update an existing transaction
 * @param id - Transaction ID
 * @param data - Transaction data
 * @returns Updated transaction response
 */
export async function updateTransaction(
  id: string,
  data: UpdateTransactionRequest
): Promise<any> {
  const response = await apiClient.put(`/transactions/${id}/`, data);
  return response.data;
}
