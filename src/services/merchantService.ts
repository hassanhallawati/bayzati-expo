import type { MerchantsResponse } from "../types/merchant";
import apiClient from "./api";

/**
 * Search for merchants by name
 * @param search - Search query string
 * @returns List of matching merchants
 */
export async function searchMerchants(
  search: string
): Promise<MerchantsResponse> {
  const response = await apiClient.get<MerchantsResponse>(
    "/merchants/",
    {
      params: { search }
    }
  );
  return response.data;
}
