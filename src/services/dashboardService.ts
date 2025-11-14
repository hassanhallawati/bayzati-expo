import type { DashboardDataResponse } from "../types/dashboard";
import apiClient from "./api";

/**
 * Fetch dashboard data for a specific period and type
 * @param period - Period in format YYYY-MM (e.g., "2025-10")
 * @param type - Transaction type: EXPENSE or INCOME
 * @returns Dashboard data response
 */
export async function getDashboardData(
  period: string,
  type: "EXPENSE" | "INCOME"
): Promise<DashboardDataResponse> {
  const response = await apiClient.get<DashboardDataResponse>(
    "/transactions/dashboard-data/",
    {
      params: {
        period,
        type,
      },
    }
  );
  return response.data;
}
