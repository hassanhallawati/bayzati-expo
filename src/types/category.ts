export interface Subcategory {
  id: string;
  name: string;
  icon_round: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export type CategoriesResponse = Category[];
