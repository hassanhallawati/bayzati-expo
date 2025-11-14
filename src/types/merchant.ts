export interface MerchantCategory {
  id: string;
  name: string;
  icon: string;
}

export interface MerchantSubcategory {
  id: string;
  name: string;
  icon_round: string;
}

export interface Merchant {
  id: string;
  merchant_name: string;
  category: MerchantCategory;
  subcategory: MerchantSubcategory;
  is_approved: boolean;
}

export type MerchantsResponse = Merchant[];
