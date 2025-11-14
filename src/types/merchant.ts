export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Subcategory {
  id: string;
  name: string;
  icon_round: string;
}

export interface Merchant {
  id: string;
  merchant_name: string;
  category: Category;
  subcategory: Subcategory;
  is_approved: boolean;
}

export type MerchantsResponse = Merchant[];
